import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import ExerciseLayoutModel from "models/exercise-layout.model";

export const gets = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await ExerciseLayoutModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    ExerciseLayoutModel
        .find({}, '-__v -updateAt')
        .populate({ path: "createBy", select: 'fullname avatar' })
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
export const create = (req, res) => {
    const exerciseLayoutDefination = {
        ...req.body,
        createBy: req.userId
    }
    const exerciseLayout = new ExerciseLayoutModel(exerciseLayoutDefination);
    exerciseLayout.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    ExerciseLayoutModel
        .findOne({ _id: req.params.layoutId })
        .populate({ path: "createBy", select: 'fullname avatar' })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], data);
        })
}
export const update = (req, res) => {
    const exerciseLayoutDefination = {
        ...req.body,
        createBy: req.userId
    }
    ExerciseLayoutModel.updateOne({ _id: req.params.layoutId }, exerciseLayoutDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.layoutId,
    }
    ExerciseLayoutModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}

export const rate = (req, res) => {
    const exerciseLayoutId = req.params.layoutId;
    const userId = req.userId;
    ExerciseLayoutModel
        .findOne({ _id: exerciseLayoutId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const postObj = {
                "idUser": userId,
                "point": req.body.point
            }
            var check = false;
            docs.rate.filter(x => {
                if (x.idUser == userId) {
                    check = true;
                }
            })
            if (check == false) {
                docs.rate.push(postObj);
            }
            if (check == true) {
                const result = docs.rate.filter(x => {
                    return x.idUser != userId
                })
                result.push(postObj)
                docs = {
                    _id: docs._id,
                    title: docs.title,
                    content: docs.content,
                    price: docs.price,
                    rate: result,
                    linkFigma: docs.linkFigma,
                    createBy: docs.createBy,
                    createdAt: docs.createdAt,
                    updatedAt: docs.updatedAt,
                }
            }
            ExerciseLayoutModel.updateOne({ _id: exerciseLayoutId }, docs, (err, data) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!data) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })

}
