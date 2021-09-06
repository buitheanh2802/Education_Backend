import NotificationModel from "../models/notification.model";
import { response } from 'constants/responseHandler';
import { assignIn } from 'lodash'

export const gets = (req, res) => {
    NotificationModel.find({}, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, ['ERROR_SERVER'], docs);
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
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}

export const update = (req, res) => {
    const conditions = {
        _id: req.params.noficationId,
        sendTo: req.userId
    }
    NotificationModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        const newData = assignIn(docs,{ isRead : true});
        newData.save((err,docs)=> {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [],{ });
        })
    });
}

export const remove = (req, res) => {
    const conditions = {
        _id: req.params.noficationId,
        sendTo: req.userId
    }
    NotificationModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        docs.remove((err,docs)=> {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [],{ });
        })
    });
}