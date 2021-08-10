import { body, validationResult } from 'express-validator';
import FeedbackModel from './../models/feedback.model';

export const feedbackValidator = async (req, res, next) => {
    await body('name').trim().notEmpty().withMessage('Nhập tên').run(req);
    await body('email').trim().notEmpty().withMessage('Nhập email ').run(req);
    await body('phone').trim().notEmpty().withMessage('Nhập phone').run(req);
    await body('title').trim().notEmpty().withMessage('Nhập tiêu đề').run(req);
    await body('content').trim().notEmpty().withMessage('Nhập nội dung').run(req);

    const check = validationResult(req);
    // điều kiện tồn tại lỗi =>
    if (!check.isEmpty()) {
        return res.status(400).json({
            message: 'validate error',
            error: check.errors
        })
    }
    // nếu k có lỗi tiến hành next() và cho create 
    next()
}

export const feedbackById = (req, res, next, id) => {
    FeedbackModel.findById(id).exec((err, feedback) => {
        if (err || !feedback) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        req.feedback = feedback;
        next();
    })
}