import QuestionModel from "models/question.model";
import SpamModel from "models/spam.model";
import { response } from "constants/responseHandler";
import { PAGINATION_REGEX } from "constants/regexDefination";

export const spamQuestionOrCmt = async (req, res) => {
    var idUser = req.userId;
    const spamDefination = {
        ...req.body,
        sender: idUser
    }
    const spams = new SpamModel(spamDefination);
    spams.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}

export const getListSpamQuestion = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await SpamModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    SpamModel
        .find({ type: 'questions' }, '-__v -updateAt')
        .populate({ path: "sender", select: 'fullname username avatar' })
        .populate({ path: "referenceTo", select: 'spam title content slug' })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
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
            });
        })
}

export const getListSpamCmt = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await SpamModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    SpamModel
        .find({ type: 'comments' }, '-__v -updateAt')
        .populate({ path: "sender", select: 'fullname username avatar' })
        .populate({ path: "referenceTo", select: 'content' })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
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
            });
        })
}


export const detailSpamQuestion = (req, res) => {
    SpamModel
        .findOne({ _id: req.params.spamId, type: "questions" })
        .populate({ path: "sender", select: 'fullname username avatar' })
        .populate({ path: "referenceTo", select: 'spam title content slug' })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            console.log(docs);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], docs);
        })
}

export const detailSpamComment = (req, res) => {
    SpamModel
        .findOne({ _id: req.params.spamId, type: "comments" })
        .populate({ path: "sender", select: 'fullname username avatar' })
        .populate({ path: "referenceTo", select: 'content' })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], docs);
        })
}
