import TagModel from "models/tag.model";
import formidable from "formidable";
import { response } from "constants/responseHandler";
import { TAGNAME, PAGINATION_REGEX } from 'constants/regexDefination';
import { cropper } from 'helpers/imageCropper';
import { createFile, createFolder } from 'services/drive';
import { toSlug } from 'helpers/slug';
import { assignIn } from 'lodash';
import jwt from "jsonwebtoken";
import PostModel from 'models/post.model';
import questionModel from "models/question.model";
import FollowModel from "models/follow.model";
import UserModel from 'models/user.model';
import mongoose from 'mongoose';

// global data 
const limited = 9;
const trendingViews = 100;

export const gets = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await TagModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    TagModel.aggregate([
        {
            $lookup: {
                from: "questions",
                localField: "_id",
                foreignField: "tags",
                as: "questions"
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "tags",
                as: "posts"
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followingUserId",
                as: "followers"
            }
        },
        {
            $addFields: {
                questionCounts: { $size: "$questions" },
                postCounts: { $size: "$posts" },
                followerCounts: { $size: "$followers" },
                isFollowing: {
                    $filter: {
                        input: "$followers",
                        as: "each",
                        cond: {
                            $eq: ["$$each.userId", token?._id]
                        }
                    }
                },
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project: {
                // _id: 0,
                updatedAt: 0,
                __v: 0,
                createdAt: 0,
                driveId: 0,
                questions: 0,
                posts: 0,
                followers: 0
            }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [],
            {
                models: docs.map(doc => {
                    if (doc.isFollowing.length === 0) doc.isFollowing = false;
                    else doc.isFollowing = true;
                    return doc
                }),
                metaData: {
                    pagination: {
                        perPage: limit,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        countDocuments: docs.length
                    }
                }
            });
    })
}

export const create = (req, res) => {
    // request cần có : name , token ,role : admin hoặc collaborators,photo
    const initialize = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024,
        keepExtensions: true
    });
    initialize.parse(req, async (err, fields, file) => {
        const { name } = fields;
        const { photo } = file;
        if (err) return response(res, 400, ['INVALID_SIZE', err.message]);
        if (!fields.name) return response(res, 400, ['INVALID_DATA']);
        if (photo) {
            await cropper({
                width: 200,
                height: 200,
                path: photo.path,
                filename: photo.name
            });
            var driveFolderResponse = await createFolder(fields.name, '1Ux1_gYhjz4vQGnInOlGdkDtQ69H4AVs1');
            var driveFileResponse = await createFile(photo.name, driveFolderResponse.id);
        }
        const createNewTag = new TagModel({
            name: name,
            slug: toSlug(name.toLowerCase(), '-'),
            avatar: {
                _id: driveFileResponse?.id,
                avatarUrl: driveFileResponse?.webContentLink
            },
            driveId: driveFolderResponse?.id
        });
        createNewTag.save((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER']);
            return response(res, 200, [])
        })
    })
}

export const update = (req, res) => {
    // request cần có : name , token ,role : admin hoặc collaborators,photo
    const initialize = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024,
        keepExtensions: true
    });
    initialize.parse(req, async (err, fields, file) => {
        const { photo } = file;
        fields.slug = toSlug(fields.name.toLowerCase(), '-');
        if (err) return response(res, 400, ['INVALID_SIZE', err.message]);
        if (!fields.name) return response(res, 400, ['INVALID_DATA']);
        TagModel.findOne({ slug: req.params.tagname.toLowerCase() }, async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER']);
            if (!docs) return response(res, 400, ['TAG_NOTEXIST']);
            const currentData = assignIn(docs, fields);
            currentData.save(async (err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER']);
                if (photo) {
                    await cropper({
                        width: 200,
                        height: 200,
                        path: photo.path,
                        filename: photo.name
                    });
                    var driveFileResponse = await createFile(photo.name, docs.driveId);
                    fields.avatar = {
                        _id: driveFileResponse.id,
                        avatarUrl: driveFileResponse.webContentLink
                    }
                }
                return response(res, 200, [])
            });
        })
    })
}

export const get = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    TagModel.findOne({ slug: toSlug(req.params.tagname, '-') }, '-__v -driveId -createdAt -updatedAt')
        .populate([
            { path: 'postCounts' },
            { path: 'questionCounts' },
            { path: 'followerCounts' }
        ])
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            docs.isFollowing = false;
            if (token) {
                docs.followerCounts.forEach(doc => {
                    // console.log(doc);
                    if (doc.userId === token?._id) {
                        docs.isFollowing = true;
                    }
                })
            }
            return response(res, 200, [], { ...docs, followerCounts: docs.followerCounts.length });
        })
}

export const popular = (req, res) => {
    TagModel.find({}, 'slug name')
        .populate({ path: 'followers' })
        .limit(20)
        .lean()
        .exec((err, docs) => {
            // console.log(docs);
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            return response(res, 200, [], docs);
        })
}
export const post = (req, res) => {
    TagModel.findOne({ slug: toSlug(req.params.tagname, '-') })
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            const { page } = req.query;
            let currentPage = 1;
            if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
            const skip = (currentPage - 1) * limited;
            const countDocuments = await PostModel.countDocuments({ tags: docs._id, isDraft: false, isAccept: true });
            const totalPage = Math.ceil(countDocuments / limited);
            PostModel.find({ tags: docs._id, isDraft: false, isAccept: true })
                .skip(skip)
                .limit(limited)
                .select('-_id views shortId title slug tags likes dislikes createBy createdAt bookmarks')
                .sort({ createdAt: -1 })
                .populate({ path: 'comments' })
                .populate({ path: 'createBy', select: '-_id username email avatar fullname' })
                .populate({ path: 'tags', select: '-_id name slug' })
                .lean()
                .exec((err, docs) => {
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    return response(res, 200, [],
                        {
                            models: docs.map(doc => ({
                                ...doc,
                                bookmarks: doc.bookmarks.length,
                                likes: doc.likes.length,
                                dislikes: doc.dislikes.length,
                                isTrending: doc.views > trendingViews ? true : false
                            })),
                            metaData: {
                                pagination: {
                                    perPage: limited,
                                    totalPage: totalPage,
                                    currentPage: currentPage,
                                    countDocuments: docs.length
                                }
                            }
                        });
                })
        })
}
export const question = (req, res) => {
    TagModel.findOne({ slug: toSlug(req.params.tagname, '-') })
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            const { page } = req.query;
            let currentPage = 1;
            if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
            const skip = (currentPage - 1) * limited;
            const countDocuments = await questionModel.countDocuments({ tags: docs._id });
            const totalPage = Math.ceil(countDocuments / limited);
            questionModel.find({ tags: docs._id })
                .skip(skip)
                .limit(limited)
                .select('_id views shortId title slug tags likes dislikes createBy createdAt bookmarks')
                .sort({ createdAt: -1 })
                .populate({ path: 'comments' })
                .populate({ path: 'createBy', select: '-_id username email avatar fullname' })
                .populate({ path: 'tags', select: '-_id name slug' })
                .lean()
                .exec((err, docs) => {
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    return response(res, 200, [],
                        {
                            models: docs.map(doc => ({
                                ...doc,
                                bookmarks: doc.bookmarks?.length || 0,
                                likes: doc.likes?.length || 0,
                                dislike: doc.dislike?.length || 0,
                                isTrending: doc.views > trendingViews ? true : false
                            })),
                            metaData: {
                                pagination: {
                                    perPage: limited,
                                    totalPage: totalPage,
                                    currentPage: currentPage,
                                    countDocuments: docs.length
                                }
                            }
                        });
                })
        })
}
export const follower = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
        // console.log(token);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    TagModel.findOne({ slug: toSlug(req.params.tagname, '-') })
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            const skip = (currentPage - 1) * limited;
            const countDocuments = await FollowModel.countDocuments({ followingUserId: docs._id });
            const totalPage = Math.ceil(countDocuments / limited);
            FollowModel.find({ followingUserId: docs._id })
                .skip(skip)
                .limit(limited)
                .sort({ createdAt: -1 })
                .select('-_id userId')
                .lean()
                .exec(async (err, docs) => {
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    if (docs.length !== 0) {
                        docs = docs.map(doc => new mongoose.Types.ObjectId(doc.userId));
                        let data = await UserModel.find({ _id: { $in: docs } },
                            'username email fullname points avatar posts questions')
                            .populate({ path: 'postCounts' })
                            .populate({ path: 'questionCounts' })
                            .populate({ path: 'followers', select: '-_id userId -followingUserId' })
                            .lean()
                            .exec()
                        // console.log(data);
                        data = data.map(doc => {
                            // console.log(doc);
                            doc.isFollowing = false;
                            if (token && doc.followers.length !== 0) {
                                console.log(token);
                                doc.followers.forEach(follow => {
                                    if (follow.userId === token._id) doc.isFollowing = true;
                                })
                            }
                            doc.followerCounts = doc.followers.length;
                            delete doc.followers
                            delete doc._id;
                            return doc;
                        })
                        docs = data;
                    }
                    return response(res, 200, [],
                        {
                            models: docs,
                            metaData: {
                                pagination: {
                                    perPage: limited,
                                    totalPage: totalPage,
                                    currentPage: currentPage,
                                    countDocuments: docs.length
                                }
                            }
                        });
                })
        })
}