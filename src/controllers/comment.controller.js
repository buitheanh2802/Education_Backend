import _, { find } from 'lodash';
import CommentModel from './../models/comment.model';

// 
export const fetchAll = (req, res) => {
    CommentModel.find({}, (err, docs) => {
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
    const comment = new CommentModel(req.body);
    comment.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Không thêm được comment'
            })
        }
        res.json({ data, message: 'Thêm comment thành công ' });
    })
}

export const update = (req, res) => {
    let comment = req.comment;
    comment = _.assignIn(comment, req.body);
    comment.save((err, data) => {
        if (err) {
            return res.status(400).json({
                message: 'Cập nhật thất bại'
            })
        }
        return res.json({ data, message: 'Cập nhật cmt thành công' })
    })
}
export const read = (req, res) => {
    return res.json(req.comment)
}
export const remove = (req, res) => {
    const comment = req.comment;
    comment.remove((err, deleteComment) => {
        if (err) {
            return res.status(400).json({
                error: 'Xóa cmt thất bại'
            })
        }
        res.json({
            deleteComment,
            message: 'Xóa thành công cmt'
        })
    })
}
