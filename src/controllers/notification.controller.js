import NotificationModel from "../models/notification.model";
import _ from 'lodash'

export const fetchAll = (req, res) => {
    NotificationModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            message: [],
            data: docs,
            status: true
        })
    })
}

export const create = (req, res) => {
    const notification = new NotificationModel(req.body);
    notification.save((err, docs) => {
        if (err) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            data: docs,
            message: [],
            status: true
        })
    })
}

export const remove = (req, res) => {
    const notification = req.notification;
    // remove drive
    notification.remove((err, docs) => {
        if (err) {
            return res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            data: docs,
            status: true
        })
    })
}
export const update = (req, res) => {
    let notification = req.notification;

    notification = _.assignIn(notification, req.body);
    notification.save((err, docs) => {
        if (err) {
            return res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        return res.status(200).json({
            data: docs,
            status: true
        })
    })
}
export const read = (req, res) => {
    return res.json(req.notification)
}