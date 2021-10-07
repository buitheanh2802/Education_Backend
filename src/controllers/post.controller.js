import PostModel from '../models/post.model';
import FollowModel from 'models/follow.model';
import TagModel from 'models/tag.model';
import { response } from 'constants/responseHandler';
import { toSlug } from 'helpers/slug';
import jwt from 'jsonwebtoken';

export const get = (req, res) => {

}

export const newest = (req, res) => {
    PostModel.aggregate([
        {
            $match : {
                isDraft : false,
                isAccept : true
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [], docs)
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
    const { tags, title, content, isDraft } = req.body;
    try {
        await TagModel.create(tags?.map(tag => {
            return {
                slug: toSlug(tag),
                name: tag
            }
        }))
    } catch (error) {

    }
    const createPost = new PostModel({
        title: title,
        content: content,
        isDraft: isDraft,
        createBy: req.userId
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