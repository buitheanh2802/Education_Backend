import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";
import CommentModel from "../models/comment.model";
import FollowModel from '../models/follow.model';
import TagModel from "models/tag.model";
import { toSlug } from 'helpers/slug';



export const gets = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await QuestionModel.countDocuments({ spam: false });
    const totalPage = Math.ceil(countDocuments / limit);
    QuestionModel
        .find({ spam: false }, '-__v -updateAt')
        .sort({ _id: -1 })
        .populate({ path: "createBy", select: 'fullname username avatar' })
        .populate({ path: "tags", select: "name slug" })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            let result = docs.map(x => {
                return {
                    _id: x._id,
                    countLikes: x.likes.length,
                    countDislike: x.dislike.length,
                    countBookmarks: x.bookmarks.length,
                    bookmarks: x.bookmarks,
                    likes: x.likes,
                    dislike: x.dislike,
                    comfirmAnswers: x.comfirmAnswers,
                    tags: x.tags,
                    title: x.title,
                    content: x.content,
                    views: x.views,
                    slug: x.slug,
                    spam: x.spam,
                    createBy: x.createBy,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt
                }
            })
            return response(res, 200, [], {
                models: result,
                metaData: {
                    pagination: {
                        perPage: limit,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        countDocuments: result.length
                    }
                }
            });
        })
}
export const create = async (req, res) => {
    // define data
    const updateDefination = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        slug: toSlug(req.body.title, '-'),
        createBy: req.userId
    }
    // create tag
    try {
        var data = await Promise.all(updateDefination
            .tags.map(async tag => {
                const docs = await TagModel.findOrCreate({ slug: toSlug(tag.toLowerCase(), '-') }
                    , { name: tag, slug: toSlug(tag.toLowerCase(), '-') });
                return docs.doc._id;
            }))
    } catch (error) {
        console.log(error.message);
    }
    const question = new QuestionModel({
        ...updateDefination, tags: data
    });
    question.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = async (req, res) => {
    QuestionModel
        .findOne({ _id: req.params.questionId })
        .populate({ path: "createBy", select: 'fullname avatar username' })
        .populate({ path: "tags", select: "name slug" })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);

            var newCmt = [];
            var createByUserId = docs.createBy._id;
            var totalQuestion = 0;
            CommentModel.find({ postOrQuestionId: req.params.questionId }, (err, resultCmt) => {
                if (resultCmt) {
                    newCmt = resultCmt;
                }
                QuestionModel.find({ createBy: createByUserId }, (err, data) => {
                    totalQuestion = data.length;
                    var result = {
                        countLikes: docs.likes.length,
                        countDislike: docs.dislike.length,
                        countBookmarks: docs.bookmarks.length,
                        countQuestion: totalQuestion,
                        likes: docs.likes,
                        dislike: docs.dislike,
                        comfirmAnswers: docs.comfirmAnswers,
                        tags: docs.tags,
                        bookmarks: docs.bookmarks,
                        _id: docs._id,
                        title: docs.title,
                        content: docs.content,
                        views: docs.views,
                        slug: docs.slug,
                        comment: newCmt,
                        countComment: newCmt.length,
                        createBy: docs.createBy,
                        createdAt: docs.createdAt,
                        updatedAt: docs.updatedAt,
                    }
                    return response(res, 200, [], result);
                })
            })



        })
}
export const update = async (req, res) => {
    const updateDefination = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        slug: toSlug(req.body.title, '-'),
        createBy: req.userId
    }
    // create tag
    try {
        var data = await Promise.all(updateDefination
            .tags.map(async tag => {
                const docs = await TagModel.findOrCreate({ slug: toSlug(tag.toLowerCase(), '-') }
                    , { name: tag, slug: toSlug(tag.toLowerCase(), '-') });
                return docs.doc._id;
            }))
    } catch (error) {
        console.log(error.message);
    }

    const questionDefination = {
        ...updateDefination, tags: data
    }
    QuestionModel.updateOne({ _id: req.params.questionId, createBy: req.userId }, questionDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.questionId,
        createBy: req.userId
    }
    QuestionModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}

export const addLike = (req, res) => {
    const userId = req.userId;

    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            return false;
        }
        var check = false;
        for (let i = 0; i < doc.likes.length; i++) {
            if (doc.likes[i] == req.userId) {
                check = true;
            }
        }
        if (check == false) {
            doc.likes.push(req.userId)
        }
        var newDislike = doc.dislike.filter(x => {
            return x != userId
        })
        const postObj = {
            likes: doc.likes,
            dislike: newDislike,
            comfirmAnswers: doc.comfirmAnswers,
            tags: doc.tags,
            _id: doc._id,
            title: doc.title,
            content: doc.content,
            views: doc.views,
            slug: doc.slug,
            createBy: doc.createBy,
        }
        QuestionModel.updateOne({ _id: req.params.questionId }, postObj, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const removeLike = (req, res) => {
    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            return false;
        }
        var result = [];
        doc.likes.filter(x => {
            if (x != req.userId) {
                result.push(x);
            }
        })
        const postObj = {
            likes: result,
            dislike: doc.dislike,
            comfirmAnswers: doc.comfirmAnswers,
            tags: doc.tags,
            _id: doc._id,
            title: doc.title,
            content: doc.content,
            views: doc.views,
            slug: doc.slug,
            createBy: doc.createBy,
        }
        QuestionModel.updateOne({ _id: req.params.questionId }, postObj, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const addDislike = (req, res) => {
    const userId = req.userId;
    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            console.log(err);
            return false;
        }
        var check = false;

        for (let i = 0; i < doc.dislike.length; i++) {
            if (doc.dislike[i] == req.userId) {
                check = true;
            }
        }
        if (check == false) {
            doc.dislike.push(req.userId)
        }
        var newLike = doc.likes.filter(x => {
            return x != userId
        })

        const postObj = {
            likes: newLike,
            dislike: doc.dislike,
            comfirmAnswers: doc.comfirmAnswers,
            tags: doc.tags,
            _id: doc._id,
            title: doc.title,
            content: doc.content,
            views: doc.views,
            slug: doc.slug,
            createBy: doc.createBy,
        }
        QuestionModel.updateOne({ _id: req.params.questionId }, postObj, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const removeDislike = (req, res) => {
    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            console.log(err);
            return false;
        }
        var result = [];
        doc.dislike.filter(x => {
            if (x != req.userId) {
                result.push(x);
            }
        })
        const postObj = {
            likes: doc.likes,
            dislike: result,
            comfirmAnswers: doc.comfirmAnswers,
            tags: doc.tags,
            _id: doc._id,
            title: doc.title,
            content: doc.content,
            views: doc.views,
            slug: doc.slug,
            createBy: doc.createBy,
        }
        QuestionModel.updateOne({ _id: req.params.questionId }, postObj, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const searchTag = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await QuestionModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    QuestionModel
        .find({ tags: req.params.tagid })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, [], {
                models: docs,
                metaData: {
                    pagination: {
                        perPage: limit,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        countDocuments: docs.length
                    }
                }
            })
        })
}

export const addBookmark = (req, res) => {
    const questionId = req.params.questionId;
    const userId = req.userId;
    QuestionModel.findById(questionId, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);

        if (docs.bookmarks.length == 0) {
            docs.bookmarks.push(userId);
        } else {
            var check = false;
            for (let i = 0; i < docs.bookmarks.length; i++) {
                if (docs.bookmarks[i] == userId) {
                    check = true;
                }
            }
            if (check == false) {
                docs.bookmarks.push(userId);
            }
        }

        var newDocs = {
            likes: docs.likes,
            dislike: docs.dislike,
            comfirmAnswers: docs.comfirmAnswers,
            tags: docs.tags,
            bookmarks: docs.bookmarks,
            _id: docs._id,
            title: docs.title,
            content: docs.content,
            views: docs.views,
            slug: docs.slug,
            createBy: docs.createBy,
            createdAt: docs.createdAt,
            updatedAt: docs.updatedAt,
        }
        QuestionModel.updateOne({ _id: questionId }, newDocs, (err, result) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!result) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const delBookmark = (req, res) => {
    const questionId = req.params.questionId;
    const userId = req.userId;
    QuestionModel.findById(questionId, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);

        const newBookMark = docs.bookmarks.filter(x => {
            if (x != userId) {
                return x
            }
        })

        var newDocs = {
            likes: docs.likes,
            dislike: docs.dislike,
            comfirmAnswers: docs.comfirmAnswers,
            tags: docs.tags,
            bookmarks: newBookMark,
            _id: docs._id,
            title: docs.title,
            content: docs.content,
            views: docs.views,
            slug: docs.slug,
            createBy: docs.createBy,
            createdAt: docs.createdAt,
            updatedAt: docs.updatedAt,
        }
        QuestionModel.updateOne({ _id: questionId }, newDocs, (err, result) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!result) return response(res, 400, ['EMPTY_DATA']);
            return response(res, 200, []);
        })
    })
}

export const listBookmark = async (req, res) => {
    const userId = req.userId;
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await QuestionModel.countDocuments({ spam: false });
    const totalPage = Math.ceil(countDocuments / limit);
    QuestionModel
        .find({ bookmarks: userId, spam: false }, '-__v -updateAt')
        .sort({ _id: -1 })
        .populate({ path: "createBy", select: 'fullname avatar' })
        .populate({ path: "tags", select: "name slug" })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            let result = docs.map(x => {
                return {
                    _id: x._id,
                    countLikes: x.likes.length,
                    countDislike: x.dislike.length,
                    comfirmAnswers: [],
                    tags: x.tags,
                    title: x.title,
                    content: x.content,
                    views: x.views,
                    spam: x.spam,
                    slug: x.slug,
                    createBy: x.createBy,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt,
                    bookmarks: x.bookmarks
                }
            })
            return response(res, 200, [], {
                models: result,
                metaData: {
                    pagination: {
                        perPage: limit,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        countDocuments: result.length
                    }
                }
            });
        })
}

export const addView = (req, res) => {
    const questionId = req.params.questionId;
    QuestionModel
        .findOne({ _id: questionId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            var result = {
                likes: docs.likes,
                dislike: docs.dislike,
                comfirmAnswers: docs.comfirmAnswers,
                tags: docs.tags,
                bookmarks: docs.bookmarks,
                _id: docs._id,
                title: docs.title,
                content: docs.content,
                views: docs.views + 1,
                slug: docs.slug,
                createBy: docs.createBy,
                createdAt: docs.createdAt,
                updatedAt: docs.updatedAt,
            }
            QuestionModel.updateOne({ _id: questionId }, result, (err, newDocs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!newDocs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}

export const follow = (req, res) => {
    const userId = req.userId;
    var listUserFollow = [];

    FollowModel.find({ userId: userId }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        listUserFollow = docs.map(x => {
            return x.followingUserId
        })

        const { page } = req.query;
        let currentPage = 1;
        if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
        const limit = 10;
        const skip = (currentPage - 1) * limit;

        QuestionModel
            .find({ createBy: listUserFollow.map(x => { return x }), spam: false })
            .sort({ _id: -1 })
            .populate({ path: "createBy", select: 'fullname avatar' })
            .populate({ path: "tags", select: "name slug" })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                const countDocuments = docs.length;
                const totalPage = Math.ceil(countDocuments / limit);
                let result = docs.map(x => {
                    return {
                        _id: x._id,
                        countLikes: x.likes.length,
                        countDislike: x.dislike.length,
                        comfirmAnswers: x.comfirmAnswers,
                        tags: x.tags,
                        title: x.title,
                        content: x.content,
                        spam: x.spam,
                        views: x.views,
                        slug: x.slug,
                        createBy: x.createBy,
                        createdAt: x.createdAt,
                        updatedAt: x.updatedAt,
                        bookmarks: x.bookmarks
                    }
                })
                return response(res, 200, [], {
                    models: result,
                    metaData: {
                        pagination: {
                            perPage: limit,
                            totalPage: Math.ceil(result.length / 10),
                            currentPage: currentPage,
                            countDocuments: result.length
                        }
                    }
                });
            })
    })
}

export const updateSpam = (req, res) => {
    QuestionModel
        .findOne({ _id: req.params.questionId }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const newObj = {
                spam: !docs.spam,
            }
            QuestionModel.updateOne({ _id: req.params.questionId }, newObj, (err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!docs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}

export const trending = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await QuestionModel.countDocuments();
    // const totalPage = Math.ceil(countDocuments / limit);
    QuestionModel
        .find({}, '-__v -updateAt')
        .sort({ _id: -1 })
        .populate({ path: "createBy", select: 'fullname avatar username' })
        .populate({ path: "tags", select: "name slug" })
        .skip(skip)
        // .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            let result = docs.filter(x => {
                if (x.views >= 100) {
                    return {
                        _id: x._id,
                        countLikes: x.likes.length,
                        countDislike: x.dislike.length,
                        countBookmarks: x.bookmarks.length,
                        bookmarks: x.bookmarks,
                        likes: x.likes,
                        dislike: x.dislike,
                        comfirmAnswers: x.comfirmAnswers,
                        tags: x.tags,
                        title: x.title,
                        content: x.content,
                        views: x.views,
                        slug: x.slug,
                        spam: x.spam,
                        createBy: x.createBy,
                        createdAt: x.createdAt,
                        updatedAt: x.updatedAt
                    }
                }
            })
            var newDocs = result.map(x => {
                return {
                    _id: x._id,
                    countLikes: x.likes.length,
                    countDislike: x.dislike.length,
                    countBookmarks: x.bookmarks.length,
                    bookmarks: x.bookmarks,
                    likes: x.likes,
                    dislike: x.dislike,
                    comfirmAnswers: x.comfirmAnswers,
                    tags: x.tags,
                    title: x.title,
                    content: x.content,
                    views: x.views,
                    slug: x.slug,
                    spam: x.spam,
                    createBy: x.createBy,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt
                }
            })
            return response(res, 200, [], {
                models: newDocs,
                metaData: {
                    pagination: {
                        perPage: limit,
                        totalPage: Math.ceil(result.length / limit),
                        currentPage: currentPage,
                        countDocuments: result.length
                    }
                }
            });
        })
}

export const search = (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const skip = (currentPage - 1) * 10;
    QuestionModel
        .find({ title: { $regex: req.body.title } })
        .skip(skip)
        .limit(10)
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            let result = docs.map(x => {
                return {
                    _id: x._id,
                    countLikes: x.likes.length,
                    countDislike: x.dislike.length,
                    countBookmarks: x.bookmarks.length,
                    bookmarks: x.bookmarks,
                    likes: x.likes,
                    dislike: x.dislike,
                    comfirmAnswers: x.comfirmAnswers,
                    tags: x.tags,
                    title: x.title,
                    content: x.content,
                    views: x.views,
                    slug: x.slug,
                    spam: x.spam,
                    createBy: x.createBy,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt
                }
            })
            return response(res, 200, [], {
                models: result,
                metaData: {
                    pagination: {
                        perPage: 10,
                        totalPage: Math.ceil((result.length) / 10),
                        currentPage: currentPage,
                        countDocuments: docs.length
                    }
                }
            });
        })
}

// filter question for admin
export const filterQuestion = (req, res) => {
    const { keyword } = req.query;
    QuestionModel.find({
        title: { $regex: keyword, $options: 'i' }
    })
        .limit(10)
        .sort({ createdAt: -1 })
        .select('_id title content createBy createdAt')
        .populate({ path: 'createBy', select: '-_id email username fullname avatar' })
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], docs);
        })
}
// other question for same author
export const otherQuestionSameAuthor = (req, res) => {
    QuestionModel
        .find({ createBy: req.params.userId, spam: false }, '_id title bookmarks createdAt slug views shortId createBy')
        .populate({ path: 'comments' })
        .populate({ path: 'createBy', select: '-_id email username fullname avatar' })
        .lean()
        .sort({ createdAt: -1 })
        .limit(10)
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], docs.map((item) => {
                item.bookmarks = item.bookmarks.length;
                return item
            }));
        })
}