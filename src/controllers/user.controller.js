import UserModel from 'models/user.model';
import FollowModel from 'models/follow.model';
import PostModel from 'models/post.model';
import { response } from "constants/responseHandler";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { PAGINATION_REGEX } from 'constants/regexDefination';
import TagModel from 'models/tag.model';
import questionModel from 'models/question.model';

// global data 
const limited = 10;
const trendingViews = 100;

export const get = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    UserModel.findOne({ username: req.params.username })
        .populate({ path: 'postCounts' })
        .populate({ path: 'questionCounts' })
        .populate({ path: 'followers' })
        .select('username fullname email points avatar')
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            const followingCounts = await FollowModel.countDocuments({ userId: String(docs._id) });
            docs.isFollowing = false;
            if (token) {
                docs.followers.forEach(doc => {
                    if (doc.userId === token?._id) {
                        docs.isFollowing = true;
                    }
                })
            }
            delete docs._id;
            docs.followers = docs.followers.length;
            return response(res, 200, [], { ...docs, followingCounts });
        })
}

export const myPostBookmark = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await PostModel.countDocuments({ bookmarks: userData._id });
    const totalPage = Math.ceil(countDocuments / limited);
    // console.log(countDocuments);
    PostModel.find({ bookmarks: userData._id })
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
}

export const myQuestion = async(req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await questionModel.countDocuments({ createBy: userData._id });
    const totalPage = Math.ceil(countDocuments / limited);
    // console.log(countDocuments);
    questionModel.find({ createBy: userData._id })
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
}

export const myPost = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await PostModel.countDocuments({ createBy: userData._id });
    const totalPage = Math.ceil(countDocuments / limited);
    // console.log(countDocuments);
    PostModel.find({ createBy: userData._id })
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
}

export const myTag = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await FollowModel.countDocuments({ userId: String(userData._id) });
    const totalPage = Math.ceil(countDocuments / limited);
    FollowModel
        .find({ userId: String(userData._id) })
        .select('-_id followingUserId createdAt')
        .sort({ createdAt: -1 })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs || docs.length == 0) return response(res, 400, ['EMPTY_DATA']);
            const filterDocs = docs.map(doc => new mongoose.Types.ObjectId(doc.followingUserId));
            TagModel.find({ _id: { $in: filterDocs } })
                .skip(skip)
                .limit(limited)
                .sort({ createdAt: -1 })
                .populate([{ path: 'postCounts' }, { path: 'questionCounts' }, { path: 'followerCounts', select: '-_id -followingUserId userId' }])
                .select('-__v -updatedAt')
                .lean()
                .exec((err, docs) => {
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    return response(res, 200, [],
                        {
                            models: docs.map(doc => {
                                doc.isFollowing = false;
                                if(token && doc.followerCounts.length !== 0){
                                    doc.followerCounts.forEach(follow => {
                                        if(token._id === follow.userId) doc.isFollowing = true;
                                    })
                                }
                                delete doc.createdAt;
                                doc.followerCounts = doc.followerCounts.length;
                                return doc;
                            }),
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

export const followers = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await FollowModel.countDocuments({ followingUserId: userData._id });
    const totalPage = Math.ceil(countDocuments / limited);
    FollowModel.find({ followingUserId: userData._id })
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
                    doc.isFollowing = false;
                    if (token && doc.followers.length !== 0) {
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
}

export const following = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const userData = await UserModel.findOne({ username: req.params.username });
    if (!userData) return response(res, 400, ['EMPTY_DATA']);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await FollowModel.countDocuments({ userId: String(userData._id) });
    const totalPage = Math.ceil(countDocuments / limited);
    FollowModel.find({ userId: String(userData._id) })
        .skip(skip)
        .limit(limited)
        .sort({ createdAt: -1 })
        .populate({
            path: 'followingUserId', select: 'username email fullname points avatar posts questions',
            populate: [{ path: 'followers', select: '-_id userId -followingUserId' },
            { path: 'postCounts' },
            { path: 'questionCounts' }
            ]
        })
        .select('-_id followingUserId')
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (docs.length == 0) return response(res, 400, ['EMPTY_DATA']);
            docs = docs.map(doc => {
                const currentDoc = doc.followingUserId;
                currentDoc.isFollowing = false;
                currentDoc.followerCounts = currentDoc.followers.length;
                if (token && currentDoc.followers.length !== 0) {
                    currentDoc.followers.forEach(follow => {
                        if (follow.userId === token._id) currentDoc.isFollowing = true;
                    })
                }
                delete currentDoc._id;
                delete currentDoc.followers;
                return currentDoc;
            })
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
                }
            );
        })
}