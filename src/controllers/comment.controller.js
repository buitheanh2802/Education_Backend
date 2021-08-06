import _, { find } from 'lodash';
import CommentModel from './../models/comment.model';

// 
export const fetchAll = (req, res) => {
    CommentModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
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

export const create = (req, res) => {
    const comment = new CommentModel(req.body);
    comment.save((err, docs) => {
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

export const update = (req, res) => {
    let comment = req.comment;
    comment = _.assignIn(comment, req.body);
    comment.save((err, docs) => {
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
    return res.json(req.comment)
}
export const remove = (req, res) => {
    const comment = req.comment;
    comment.remove((err, docs) => {
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
