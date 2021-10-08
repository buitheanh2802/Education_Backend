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

export const newest = async(req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 15;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await PostModel.countDocuments();
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
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip : skip
        },
        {
            $limit : limit
        }
        ,
        {
            $project: {
                _id : 0,
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

export const following = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        console.log('error', error.message);
    }
    FollowModel.aggregate([
        {
            $match: {
                userId: token?._id
            }
        },
        {
            $group: {
                _id: '$userId',
                followings: { $push: '$followingUserId' }
            }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        PostModel.find({ $or: [{ createBy: { $in: docs[0].followings } }, { tags: { $in: docs[0].followings } }] })
            .exec((err, data) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return response(res, 200, [], data)
            })
        // return response(res, 200, [],
        //     {
        //         models: docs.map(doc => {
        //             if(doc.isFollowing.length === 0) doc.isFollowing = false;
        //             else doc.isFollowing = true;
        //             return doc
        //         }),
        //         metaData: {
        //             pagination: {
        //                 perPage: limit,
        //                 totalPage: totalPage,
        //                 currentPage: currentPage,
        //                 countDocuments: docs.length
        //             }
        //         }
        //     });
    })
}

export const create = async (req, res) => {
    const { tags, title, content, isDraft, slug } = req.body;
    try {
        await TagModel.create(tags?.map(tag => {
            return {
                slug: toSlug(tag, '-'),
                name: tag
            }
        }))
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