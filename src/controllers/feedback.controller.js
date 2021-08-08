import FeedbackModel from './../models/feedback.model';
import _ from 'lodash';

export const fetchAll = (req, res) => {
    FeedbackModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: [
                    'ERROR_SERVER',
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            data: docs,
            status: true,
            message : []
        })
    })
}
export const create = (req, res) => {
    const feedback = new FeedbackModel(req.body);
    feedback.save((err, docs) => {
        if (err) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            message : [],
            data: docs,
            status: true
        })
    })
}
export const update = (req, res) => {
    let feedback = req.feedback;
    feedback = _.assignIn(feedback, req.body);
    feedback.save((err, docs) => {
        if (err) {
            return res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        return res.status(200).json({
            message : [],
            data: docs,
            status: true
        })
    })
}
export const read = (req, res) => {
    return res.json(req.feedback)
}
export const remove = (req, res) => {
    const feedback = req.feedback;
    feedback.remove((err, docs) => {
        if (err) {
            return res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            message : [],
            data: docs,
            status: true
        })
    })
}