import NotificationModel from "../models/notification.model";
import { response } from 'constants/responseHandler';
import { PAGINATION_REGEX } from 'constants/regexDefination';

export const gets = async(req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await NotificationModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    NotificationModel
        .find({ sendTo : req.userId },'-__v -updatedAt')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
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

export const create = (req, res) => {
    const notificationDefination = {
        title: req.body.title,
        url: req.body.url,
        sender: req.userId,
        sendTo: req.params.sendTo
    }
    const notification = new NotificationModel(notificationDefination);
    notification.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, [], docs);
    })
}

export const update = (req, res) => {
    const conditions = {
        _id: req.params.noficationId,
        sendTo: req.userId
    }
    NotificationModel.updateOne(conditions,{ isRead : true },(err,docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        return response(res, 200, [], {});
    })
}

export const remove = (req, res) => {
    const conditions = {
        _id: req.params.noficationId,
        sendTo: req.userId
    }
    NotificationModel.deleteOne(conditions,(err,docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        return response(res, 200, [], {});
    })
}