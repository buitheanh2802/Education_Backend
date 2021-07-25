import LessionModel from "./../models/lession.model";
import { body, validationResult } from 'express-validator'

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

export const create = async (req, res) => {
    await body('title').trim().notEmpty().withMessage('Nhập tiêu đề').run(req);
    await body('linkLession').trim().notEmpty().withMessage('Nhập link ').run(req);
    await body('courseID').trim().notEmpty().withMessage('Nhập ID course').run(req);

    const check = validationResult(req);
    console.log(check);
    if (check.isEmpty()) {
        const lession = new LessionModel(req.body);
        lession.save((err, data) => {
            if (err) {
                res.status(400).json({
                    error: 'Không thêm được bài giảng'
                })
            }
            res.json({ data, message: "Thêm bài giảng thành công" })
        })
    } else res.json({ error: 'error' })
}