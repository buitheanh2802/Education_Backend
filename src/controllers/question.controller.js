import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";
import { async } from "regenerator-runtime";

export const gets = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await QuestionModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    QuestionModel
        .find({}, '-__v -updateAt')
        .populate({ path: "createBy", select: 'fullname avatar' })
        .populate({ path: "tags", select: "name" })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            let result = docs.map(x => {
                return {
                    _id: x._id,
                    likes: x.likes.length,
                    dislike: x.dislike.length,
                    comfirmAnswers: [],
                    tags: x.tags,
                    title: x.title,
                    content: x.content,
                    views: x.views,
                    slug: x.slug,
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
                        countDocuments: docs.length
                    }
                }
            });
        })
}
export const create = (req, res) => {

    const questionDefination = {
        ...req.body,
        createBy: req.userId
    }
    const question = new QuestionModel(questionDefination);
    question.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    QuestionModel
        .findOne({ _id: req.params.questionId })
        .populate({ path: "createBy", select: 'fullname avatar' })
        .populate({ path: "tags", select: "name" })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], data);
        })
}
export const update = (req, res) => {
    const questionDefination = {
        ...req.body,
        createBy: req.userId
    }
    QuestionModel.updateOne({ _id: req.params.questionId }, questionDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.questionId,
    }
    QuestionModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}

export const addLike = (req, res) => {
    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            console.log(err);
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

        const postObj = {
            likes: doc.likes,
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

export const removeLike = (req, res) => {
    QuestionModel.findById(req.params.questionId, (err, doc) => {
        if (err) {
            console.log(err);
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

        const postObj = {
            likes: doc.likes,
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
