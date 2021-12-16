import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import formidable from "formidable";
import { cropper } from "helpers/imageCropper";
import ChallengeModel from "models/challenges.model";
import { createFile } from "services/drive";
import { createFileSystem, removeFileSystem } from "services/system";

export const gets = async (req, res) => {
    // console.log(req.body.level);
    const cateId = req.params.cateId;
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await ChallengeModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    if (req.body.level == undefined) {
        ChallengeModel
            .find({ challengeCategoryId: cateId }, '-__v -updateAt')
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
    } else {
        if (req.body.level == 1) {
            ChallengeModel
                .find({ challengeCategoryId: cateId, $or: [{ level: 1 }, { level: 2 }] }, '-__v -updateAt')
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
        if (req.body.level == 2) {
            ChallengeModel
                .find({ challengeCategoryId: cateId, $or: [{ level: 3 }, { level: 4 }] }, '-__v -updateAt')
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
        if (req.body.level == 3) {
            ChallengeModel
                .find({ challengeCategoryId: cateId, $or: [{ level: 5 }] }, '-__v -updateAt')
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

    }

}
export const create = (req, res) => {
    const challengesDefination = {
        ...req.body,
        createBy: req.userId
    }
    const challenges = new ChallengeModel(challengesDefination);
    challenges.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    ChallengeModel
        .findOne({ _id: req.params.challengeId })
        .populate({ path: "createBy", select: 'fullname avatar' })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], docs);
        })
}
export const update = (req, res) => {
    const challengesDefination = {
        ...req.body,
        createBy: req.userId
    }
    ChallengeModel.updateOne({ _id: req.params.challengeId }, challengesDefination, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.challengeId,
    }
    ChallengeModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    });
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
            var driveFileResponse = await createFile(image.name, '16zvsRSMygs5Icfyohr-SVMPyLKoPI3Xj');
        }
        return response(res, 200, [], driveFileResponse)

    })
}

export const uploadFile = (req, res) => {
    const initialize = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024,
        keepExtensions: true
    });
    initialize.parse(req, async (err, fields, file) => {
        const { image } = file;
        if (image.type != 'application/zip') return response(res, 400, ['ERROR_TYPE_FILE'])
        if (err) return response(res, 400, ['INVALID_SIZE', err.message])
        if (image) {
            createFileSystem(image.name, image.path);
            var driveFileResponse = await createFile(image.name, '16zvsRSMygs5Icfyohr-SVMPyLKoPI3Xj');
            removeFileSystem(image.name);
        }
        return response(res, 200, [], driveFileResponse)
    })
}

export const addSubmitedUser = (req, res) => {
    const challengeId = req.params.challengeId;
    const userId = req.userId;
    ChallengeModel
        .findOne({ _id: challengeId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);

            var newSubmitedBy = docs.submitedBy;
            if (newSubmitedBy.length == 0) {
                newSubmitedBy.push(userId)
            } else {
                var check = false;
                newSubmitedBy.filter(x => {
                    if (x == userId) {
                        check = true
                    }
                })
                if (check == false) {
                    newSubmitedBy.push(userId)
                }
            }

            var result = {
                submitedBy: newSubmitedBy,
                solutionSubmitedBy: docs.solutionSubmitedBy,
                _id: docs._id,
                title: docs.title,
                descriptions: docs.descriptions,
                level: docs.level,
                challengeCategoryId: docs.challengeCategoryId,
                figmaUrl: docs.figmaUrl,
                resourceUrl: docs.resourceUrl,
                avatar: docs.avatar,
                createBy: docs.createBy,
                createdAt: docs.createdAt,
                updatedAt: docs.updatedAt,
            }

            ChallengeModel.updateOne({ _id: challengeId }, result, (err, newDocs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!newDocs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}

export const solutionSubmitedBy = (req, res) => {
    const challengeId = req.params.challengeId;
    const userId = req.userId;
    ChallengeModel
        .findOne({ _id: challengeId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);

            var newSolutionSubmitedBy = docs.solutionSubmitedBy;
            if (newSolutionSubmitedBy.length == 0) {
                newSolutionSubmitedBy.push(userId)
            } else {
                var check = false;
                newSolutionSubmitedBy.filter(x => {
                    if (x == userId) {
                        check = true
                    }
                })
                if (check == false) {
                    newSolutionSubmitedBy.push(userId)
                }
            }

            var result = {
                submitedBy: docs.submitedBy,
                solutionSubmitedBy: newSolutionSubmitedBy,
                _id: docs._id,
                title: docs.title,
                descriptions: docs.descriptions,
                level: docs.level,
                challengeCategoryId: docs.challengeCategoryId,
                figmaUrl: docs.figmaUrl,
                resourceUrl: docs.resourceUrl,
                avatar: docs.avatar,
                createBy: docs.createBy,
                createdAt: docs.createdAt,
                updatedAt: docs.updatedAt,
            }

            ChallengeModel.updateOne({ _id: challengeId }, result, (err, newDocs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!newDocs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}