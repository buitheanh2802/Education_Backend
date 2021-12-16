import { response } from 'constants/responseHandler';
import _ from 'lodash';
import CommentModel from './../models/comment.model';
import { PAGINATION_REGEX } from 'constants/regexDefination';
import jwt from 'jsonwebtoken';
import { commentManager } from 'constants/globalVariables';

// gets
export const gets = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await CommentModel.countDocuments({ postOrQuestionId: req.params.postOrQuestionId, parentId: null });
    const totalPage = Math.ceil(countDocuments / limit);
    CommentModel.aggregate([
        {
            $match: {
                postOrQuestionId: req.params.postOrQuestionId,
                parentId: null
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'parentId',
                as: 'replyComments'
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
            $unwind: { path: '$replyComments', preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: '$createBy', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replyComments.createBy',
                foreignField: '_id',
                as: 'replyComments.createBy'
            }
        },
        {
            $unwind: { path: '$replyComments.createBy', preserveNullAndEmptyArrays: true }
        },
        {
            $group: {
                _id: '$_id',
                content: { $first: '$content' },
                likes: { $first: '$likes' },
                dislikes: { $first: '$dislikes' },
                createBy: { $first: '$createBy' },
                createdAt: { $first: '$createdAt' },
                replyComments: { $push: '$replyComments' }
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
                _id: 1,
                likes: 1,
                dislikes: 1,
                content: 1,
                createdAt: 1,
                'createBy.fullname': 1,
                'createBy.username': 1,
                'createBy.email': 1,
                'createBy.avatar': 1,
                'replyComments._id': 1,
                'replyComments.likes': 1,
                'replyComments.dislikes': 1,
                'replyComments.content': 1,
                'replyComments.createdAt': 1,
                'replyComments.createBy.fullname': 1,
                'replyComments.createBy.username': 1,
                'replyComments.createBy.email': 1,
                'replyComments.createBy.avatar': 1,
            }
        }
    ]).exec((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        docs.forEach(doc => {
            doc.isLike = false;
            doc.isDislike = false;
            if (token) {
                doc.likes.forEach(like => {
                    if (like == token?._id) doc.isLike = true;
                })
                doc.dislikes.forEach(dislike => {
                    if (dislike == token?._id) doc.isDislike = true;
                })
            }
            doc.replyComments.forEach(reply => {
                if (!reply._id) {
                    delete doc.replyComments;
                    return;
                }
                reply.isLike = false;
                reply.isDislike = false;
                reply.likes.forEach(like => {
                    if (like == token?._id) reply.isLike = true;
                })
                reply.dislikes.forEach(dislike => {
                    if (dislike == token?._id) reply.isDislike = true;
                })
                reply.likes = reply.likes.length;
                reply.dislikes = reply.dislikes.length;
            });
            doc.likes = doc.likes.length;
            doc.dislikes = doc.dislikes.length;
        })
        return response(res, 200, [],
            {
                models: docs,
                metaData: {
                    pagination: {
                        totalCounts: countDocuments,
                        perPage: limit,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        countDocuments: docs.length
                    }
                }
            });
    })
}
// create
export const create = (req, res) => {
    const dataDefination = {
        content: req.body.content,
        createBy: req.userId,
        postOrQuestionId: req.body.postOrQuestionId,
        parentId: req.body.parentId
    }
    const comment = new CommentModel(dataDefination);
    comment.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        docs
            .populate({ path: 'createBy', select: 'avatar username fullname email' })
            .execPopulate()
            .then(docs => {
                const documentReponse = docs.toObject({
                    transform: (_, pureObject) => {
                        delete pureObject.updatedAt;
                        delete pureObject.__v;
                        delete pureObject.postOrQuestionId;
                        delete pureObject?.parentId;
                        pureObject.likes = pureObject.likes?.length;
                        pureObject.dislikes = pureObject.dislikes?.length;
                        return pureObject;
                    }
                });
                return response(res, 200, [], { ...documentReponse, isLike: false, isDislike: false });
            })
            .catch(err => response(res, 500, ['ERROR_SERVER', err.message]))
    })
}
// update
export const update = (req, res) => {
    CommentModel.updateOne({ _id: req.params.commentId, createBy: req.userId },
        { content: req.body.content }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, []);
        })
}
// remove
export const remove = (req, res) => {
    CommentModel.deleteOne({ _id: req.params.commentId, createBy: req.userId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, []);
    })
}
// like and dislike
export const action = (config) => {
    return (req, res) => {
        CommentModel.findOne({ _id: req.params.commentId }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (config.type === 'dislikes') docs['likes'].splice(docs['likes'].indexOf(req.userId), 1);
            else docs['dislikes'].splice(docs['dislikes'].indexOf(req.userId), 1);
            if (docs[config.type].includes(req.userId)) docs[config.type].splice(docs[config.type].indexOf(req.userId), 1);
            else docs[config.type].push(req.userId)
            docs.save((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return response(res, 200, [])
            })
        })
    }
}

export const updateSpam = (req, res) => {
    CommentModel
        .findOne({ _id: req.params.commentId }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const newObj = {
                spam: !docs.spam,
            }
            CommentModel.updateOne({ _id: req.params.commentId }, newObj, (err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!docs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}

// manager list
export const managerList = async(req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = commentManager;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await CommentModel.countDocuments({});
    const totalPage = Math.ceil(countDocuments / limit);
    CommentModel.find({},'parentId spam content createBy createdAt')
        .skip(skip)
        .limit(limit)
        .populate({ path : 'createBy',select : 'username email fullname avatar '})
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [],
                {
                    models: docs,
                    metaData: {
                        pagination: {
                            totalCounts: countDocuments,
                            perPage: limit,
                            totalPage: totalPage,
                            currentPage: currentPage,
                            countDocuments: docs.length
                        }
                    }
                });
        })
}

// manager delete
export const managerDelete = (req, res) => {
    // remove
    CommentModel.deleteOne({ _id: req.params.commentId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        console.log(docs);
        return response(res, 200, []);
    })
}