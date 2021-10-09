import PostModel from '../models/post.model';
import FollowModel from 'models/follow.model';
import TagModel from 'models/tag.model';
import { response } from 'constants/responseHandler';
import { toSlug } from 'helpers/slug';
import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import { PAGINATION_REGEX } from 'constants/regexDefination';

export const get = (req, res) => {

}

export const newest = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 15;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: true,isDraft : false,isPublished : true });
    const totalPage = Math.ceil(countDocuments / limit);
    PostModel.aggregate([
        {
            $match: {
                isDraft: false,
                isAccept: true,
                isPublished: true
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
                tags: 1,
                shortId: 1,
                likes: 1,
                dislikes: 1,
                createdAt: 1,
                'createBy.avatar': 1,
                'createBy.username': 1,
                'createBy.email': 1,
                'createBy.fullname': 1,
                comments: 1,
                bookmarks: 1
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
    } catch (error) {
        console.log('error', error.message);
        return response(res, 400, ['EMPTY_TOKEN']); 
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 15;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments({ isAccept: true,isDraft : false,isPublished : true });
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
                tagFollowings: { $push: '$tagFollowings.name' }
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
            .populate({ path : 'createBy', select : '-_id username email avatar fullname'})
            .populate({ path : 'comments'})
            .select('-_id views shortId title slug tags likes dislikes createBy createdAt bookmarks')
            .sort({ createdAt : -1 })
            .lean()
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return response(res, 200, [],
                    {
                        models: docs.map(doc => ({...doc,
                            bookmarks : doc.bookmarks.length,
                            likes : doc.likes.length,
                            dislikes : doc.dislikes.length
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

export const create = async (req, res) => {
    const { tags, title, content, isDraft } = req.body;
    try {
        await TagModel.create(tags?.map(tag => {
            return {
                slug: toSlug(tag, '-'),
                name: tag
            }
        }));
    } catch (error) {
        console.log(error.message);
    }
    const createPost = new PostModel({
        title: title,
        content: content,
        isDraft: isDraft,
        createBy: req.userId,
        tags: tags,
        shortId: shortid.generate(),
        slug: toSlug(title, '-')
    });
    createPost.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [])
    })
}

export const update = (req, res) => {

}

export const remove = (req, res) => {

}