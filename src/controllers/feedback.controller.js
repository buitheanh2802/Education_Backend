import FeedbackModel from './../models/feedback.model';
import _ from 'lodash';

export const fetchAll = (req, res) => {
    FeedbackModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: err.message
            })
        }
        res.status(200).json({
            docs
        })
    })
}
export const create = (req, res) => {
    const feedback = new FeedbackModel(req.body);
    feedback.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Không thêm được feedback'
            })
        }
        res.json({ data, message: "Thêm feedback thành công !!!" })
    })
}
export const update = (req, res) => {
    let feedback = req.feedback;
    feedback = _.assignIn(feedback, req.body);
    feedback.save((err, data) => {
        if (err) {
            return res.status(400).json({
                message: 'Cập nhật feedback'
            })
        }
        return res.json({ data, message: 'Cập nhật feedback thành công' })
    })
}
export const read = (req, res) => {
    return res.json(req.feedback)
}
export const remove = (req, res) => {
    const feedback = req.feedback;
    feedback.remove((err, deleteFeedback) => {
        if (err) {
            return res.status(400).json({
                error: "Xóa thất bại feedback"
            })
        }
        res.json({
            deleteFeedback,
            message: "Xóa thành công feedback"
        })
    })
}