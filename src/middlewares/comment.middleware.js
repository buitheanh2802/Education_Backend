import CommentModel from './../models/comment.model';
import { body, validationResult } from 'express-validator';

export const commentValidator = async (req, res, next) => {
    await body('content').trim().notEmpty().withMessage('Nhập content').run(req);
    await body('userID').trim().notEmpty().withMessage('Nhập user Id').run(req);
    await body('lessionID').trim().notEmpty().withMessage('Nhập lession id').run(req);

    const check = validationResult(req);
    if (!check.isEmpty()) {
        return res.status(400).json({
            // vì errors trả về một mảng nên destructuring luôn
            message: [
                ...check.errors
            ],
            status : false
        })
    }
    next();
}

export const commentById = (req, res, next, id) => {
    CommentModel.findById(id).exec((err, comment) => {
        if (err || !comment) {
            res.status(400).json({
                error: "Không tìm thấy cmt"
            })
        }
        req.comment = comment;
        next();
    })
}