import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import formidable from "formidable";
import { cropper } from "helpers/imageCropper";
import ChallengeCategoriesModel from "models/challengeCategories.model";
import { createFile } from "services/drive";

export const gets = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await ChallengeCategoriesModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    ChallengeCategoriesModel
        .find({}, '-__v -updateAt')
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
    const challengeCategoriesDefination = {
        ...req.body
    }
    const challengeCategories = new ChallengeCategoriesModel(challengeCategoriesDefination);
    challengeCategories.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    ChallengeCategoriesModel
        .findOne({ _id: req.params.challengeCategoriesId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], docs);
        })
}
export const update = (req, res) => {
    const challengeCategoriesDefination = {
        ...req.body
    }
    ChallengeCategoriesModel.updateOne({ _id: req.params.challengeCategoriesId }, challengeCategoriesDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.challengeCategoriesId,
    }
    ChallengeCategoriesModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}

export const uploadImage = (req, res) => {
    const initialize = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024,
        keepExtensions: true
    });
    initialize.parse(req, async (err, fields, file) => {
        const { image } = file;
        if (err) return response(res, 400, ['INVALID_SIZE', err.message])
        if (image) {
            await cropper({
                width: 200,
                height: 200,
                path: image.path,
                filename: image.name
            });
            var driveFileResponse = await createFile(image.name, '1wZ9yrdzNkIJLVgHLQUWYtXlUxfEF8Ata');
            console.log(driveFileResponse);
        }
        return response(res, 200, [], driveFileResponse)

    })
}