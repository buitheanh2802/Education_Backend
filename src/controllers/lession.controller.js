import LessionModel from "./../models/lession.model";
import _ from 'lodash'

export const fetchAll = (req, res) => {
    LessionModel.find({}, (err, docs) => {
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
    const lession = new LessionModel(req.body);
    lession.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Không thêm được bài giảng'
            })
        }
        res.json({ data, message: "Thêm bài giảng thành công !!!" })
    })
}

export const remove = (req, res) => {
    const lession = req.lession;
    lession.remove((err, deleteLession) => {
        if (err) {
            return res.status(400).json({
                error: "Xóa thất bại bài giảng"
            })
        }
        res.json({
            deleteLession,
            message: "Xóa thành công bài giảng"
        })
    })
}
export const update = (req, res) => {
    let lession = req.lession;
    lession = _.assignIn(lession, req.body);
    lession.save((err, data) => {
        if (err) {
            return res.status(400).json({
                message: 'Cập nhật thất bại'
            })
        }
        return res.json({ data, message: 'Cập nhật bài giảng thành công' })
    })
}
export const read = (req, res) => {
    return res.json(req.lession)
}