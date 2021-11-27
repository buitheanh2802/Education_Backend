import PostModel from '../models/post.model';
import FollowModel from 'models/follow.model';
import TagModel from 'models/tag.model';
import { response } from 'constants/responseHandler';
import { toSlug } from 'helpers/slug';
import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import { PAGINATION_REGEX } from 'constants/regexDefination';
import userModel from 'models/user.model';
import mongoose from 'mongoose';

// global variables
const trendingViews = 200;
const postLimit = 15;
// end

export const get = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    PostModel.findOne({
        $or: [
            {
                shortId: req.params.shortId,
                isAccept: true
            },
            {
                shortId: req.params.shortId,
                isAccept: false,
                isDraft: true,
                createBy: token?._id
            }
        ]
    }, '-_id views shortId title content slug tags likes dislikes createBy createdAt bookmarks')
        .populate({ path: 'tags', select: '-_id name slug' })
        .lean()
        .populate({ path: 'comments'})
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, [], {});
            userModel.findOne({ _id: docs.createBy })
                .populate({ path: 'postCounts' })
                .populate({ path: 'questionCounts' })
                .populate({ path: 'followers', select: '-_id userId' })
                .lean()
                .select('username email fullname points avatar posts questions')
                .exec((err, docsUser) => {
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    const mergeData = { ...docs, createBy: docsUser };
                    mergeData.isLike = false;
                    mergeData.isBookmark = false;
                    mergeData.isDislike = false;
                    mergeData.createBy.isFollowing = false;
                    if (token) {
                        mergeData.likes.forEach(like => {
                            if (like == token?._id) mergeData.isLike = true
                        });
                        mergeData.dislikes.forEach(dislike => {
                            if (dislike == token?._id) mergeData.isDislike = true
                        });
                        mergeData.bookmarks.forEach(bookmark => {
                            if (bookmark == token?._id) mergeData.isBookmark = true;
                        });
                        mergeData.createBy.followers.forEach(follower => {
                            if (follower.userId == token?._id) mergeData.createBy.isFollowing = true;
                        });
                    }
                    mergeData.likes = mergeData.likes.length;
                    mergeData.dislikes = mergeData.dislikes.length;
                    mergeData.bookmarks = mergeData.bookmarks.length;
                    delete mergeData.createBy.followers;
                    delete mergeData.createBy._id
                    return response(res, 200, [], mergeData);
                })
        })
}

export const newest = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = postLimit;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: true, isDraft: false });
    const totalPage = Math.ceil(countDocuments / limit);
    PostModel.aggregate([
        {
            $match: {
                isDraft: false,
                isAccept: true
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'shortId',
                foreignField: 'postOrQuestionId',
                as: 'comments'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createBy',
                foreignField: '_id',
                as: 'createBy'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        }
        ,
        {
            $unwind: { path: '$createBy', preserveNullAndEmptyArrays: true }
        }
        ,
        {
            $addFields: {
                likes: { $size: '$likes' },
                dislikes: { $size: '$dislikes' },
                comments: { $size: '$comments' },
                bookmarks: { $size: '$bookmarks' },
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
        }
        ,
        {
            $project: {
                _id: 0,
                views: 1,
                shortId: 1,
                title: 1,
                slug: 1,
                'tags.name': 1,
                'tags.slug': 1,
                shortId: 1,
                likes: 1,
                dislikes: 1,
                createdAt: 1,
                'createBy.avatar': 1,
                'createBy.username': 1,
                'createBy.email': 1,
                'createBy.fullname': 1,
                comments: 1,
                bookmarks: 1,
                isTrending: {
                    $cond: {
                        if: { $gte: ["$views", trendingViews] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [],
            {
                models: docs,
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

export const following = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
        // console.log(token);
    } catch (error) {
        // console.log('error', error.message);
        return response(res, 400, ['EMPTY_TOKEN']);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = postLimit;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: true, isDraft: false });
    const totalPage = Math.ceil(countDocuments / limit);
    FollowModel.aggregate([
        {
            $match: {
                userId: token?._id
            }
        },
        {
            $group: {
                _id: '$userId',
                postFollowings: { $push: '$followingUserId' }
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'postFollowings',
                foreignField: '_id',
                as: 'tagFollowings'
            }
        },
        {
            $unwind: { path: '$tagFollowings', preserveNullAndEmptyArrays: true }
        },
        {
            $group: {
                _id: '$_id',
                postFollowings: { $first: '$postFollowings' },
                tagFollowings: { $push: '$tagFollowings._id' }
            }
        },
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        PostModel.find({
            $or: [{ createBy: { $in: docs[0].postFollowings } }, { tags: { $in: docs[0].tagFollowings } }],
            isAccept: true, isDraft: false
        })
            .skip(skip)
            .limit(limit)
            .populate({ path: 'createBy', select: '-_id username email avatar fullname' })
            .populate({ path: 'comments' })
            .populate({ path: 'tags', select: '-_id name slug' })
            .select('-_id views shortId title slug tags likes dislikes createBy createdAt bookmarks')
            .sort({ createdAt: -1 })
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
                                perPage: limit,
                                totalPage: totalPage,
                                currentPage: currentPage,
                                countDocuments: docs.length
                            }
                        }
                    });
            })
    })
}

export const trending = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = postLimit;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: true, isDraft: false, views: { $gte: trendingViews } });
    const totalPage = Math.ceil(countDocuments / limit);
    PostModel.aggregate([
        {
            $match: {
                isDraft: false,
                isAccept: true,
                views: { $gte: trendingViews }
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'shortId',
                foreignField: 'postOrQuestionId',
                as: 'comments'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createBy',
                foreignField: '_id',
                as: 'createBy'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $unwind: { path: '$createBy', preserveNullAndEmptyArrays: true }
        }
        ,
        {
            $addFields: {
                likes: { $size: '$likes' },
                dislikes: { $size: '$dislikes' },
                comments: { $size: '$comments' },
                bookmarks: { $size: '$bookmarks' },
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
        }
        ,
        {
            $project: {
                _id: 0,
                views: 1,
                shortId: 1,
                title: 1,
                slug: 1,
                'tags.name': 1,
                'tags.slug': 1,
                shortId: 1,
                likes: 1,
                dislikes: 1,
                createdAt: 1,
                'createBy.avatar': 1,
                'createBy.username': 1,
                'createBy.email': 1,
                'createBy.fullname': 1,
                comments: 1,
                bookmarks: 1,
                isTrending: {
                    $cond: {
                        if: { $gte: ["$views", trendingViews] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [],
            {
                models: docs,
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

export const create = async (req, res) => {
    const { tags, title, content, isDraft } = req.body;
    // create tag
    try {
        var data = await Promise.all(tags.map(async tag => {
            const docs = await TagModel.findOrCreate({ slug: toSlug(tag.toLowerCase(),'-') }
                , { name: tag, slug: toSlug(tag.toLowerCase(),'-') });
            return docs.doc._id;
        }))
    } catch (error) {
        // console.log(error.message);
    }
    console.log(data);
    const createPost = new PostModel({
        title: title,
        content: content,
        isDraft: isDraft,
        createBy: req.userId,
        tags: data,
        shortId: shortid.generate(),
        slug: toSlug(title, '-')
    });
    createPost.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [])
    })
}

export const update = async (req, res) => {
    // define data
    const updateDefination = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        isDraft: req.body.isDraft ? req.body.isDraft : false,
        slug: toSlug(req.body.title, '-')
    }
    // create tag
    try {
        var data = await Promise.all(updateDefination
            .tags.map(async tag => {
                const docs = await TagModel.findOrCreate({ slug: toSlug(tag.toLowerCase(),'-') }
                    , { name: tag, slug: toSlug(tag.toLowerCase(),'-') });
                return docs.doc._id;
            }))
    } catch (error) {
        console.log(error.message);
    }
    updateDefination.tags = data;
    PostModel.updateOne({ shortId: req.params.shortId, createBy: req.userId }, updateDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (docs.nModified == 0) return response(res, 400, ['ACCESS_DENIED']);
        return response(res, 200, []);
    })
}

export const remove = (req, res) => {
    PostModel.deleteOne({ shortId: req.params.shortId, createBy: req.userId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (docs.n == 0) return response(res, 400, ['ACCESS_DENIED']);
        return response(res, 200, []);
    })
}
// like and dislike, bookmark
export const action = (config) => {
    return (req, res) => {
        PostModel.findOne({ shortId: req.params.shortId }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (config.type === 'dislikes') docs['likes'].splice(docs['likes'].indexOf(req.userId), 1);
            if (config.type === 'likes') docs['dislikes'].splice(docs['dislikes'].indexOf(req.userId), 1);
            if (docs[config.type].includes(req.userId)) docs[config.type].splice(docs[config.type].indexOf(req.userId), 1);
            else docs[config.type].push(req.userId)
            docs.save((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return response(res, 200, [])
            })
        })
    }
}

// publish lish 
export const publishList = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = postLimit;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: false, isDraft: false });
    const totalPage = Math.ceil(countDocuments / limit);
    PostModel.find({ isDraft: false, isAccept: false }, '-_id shortId createdAt slug title content ')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({ path: 'createBy', select: '-_id avatar points fullname username email' })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [],
                {
                    models: docs,
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

// publish accept
export const publish = (req, res) => {
    const dataDefination = {
        isDraft: false,
        isAccept: true,
        publishedBy: new mongoose.Types.ObjectId(req.userId)
    }
    PostModel.updateOne({ shortId: req.params.shortId, isDraft: false, isAccept: false }
        , dataDefination, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, []);
        })
}
// unpublish 
export const unPublish = (req, res) => {
    PostModel.updateOne({ shortId: req.params.shortId, isDraft: false, isAccept: false }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, []);
    })
}
// edit post
export const edit = (req, res) => {
    // console.log(req.userId);
    PostModel.findOne({ shortId: req.params.shortId, createBy: req.userId }, '-_id shortId title content tags')
        .populate({ path: 'tags', select: '-_id name slug' })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 401, ['ACCESS_DENIED']);
            return response(res, 200, [], docs);
        })
}
// my bookmark
export const myBookmark = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = postLimit;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ bookmarks: new mongoose.Types.ObjectId(req.userId) });
    const totalPage = Math.ceil(countDocuments / limit);
    PostModel.find({ bookmarks: new mongoose.Types.ObjectId(req.userId) }, '-_id title bookmarks dislikes likes dislike tags createdAt slug views shortId createBy')
        .skip(skip)
        .limit(limit)
        .populate({ path: 'comments' })
        .populate({ path: 'tags', select: '-_id name slug' })
        .populate({ path: 'createBy', select: '-_id email username fullname avatar' })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 401, ['ACCESS_DENIED']);
            return response(res, 200, [],
                {
                    models: docs.map(doc => ({
                        ...doc, likes: doc.likes.length,
                        dislikes: doc.dislikes.length,
                        bookmarks: doc.bookmarks.length,
                        isTrending: doc.views > trendingViews ? true : false
                    })),
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