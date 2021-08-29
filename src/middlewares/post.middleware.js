import PostModel from '../models/post.model';
import { body, validationResult } from 'express-validator';

export const postValidator = async (req, res, next) => {

    await body('title').trim().notEmpty().withMessage('Nhập title').run(req);
    await body('content').trim().notEmpty().withMessage('Nhập content').run(req);
    await body('views').trim().notEmpty().withMessage('Nhập view').run(req);
    await body('isPublished').trim().notEmpty().withMessage('Chọn chế độ ẩn/hiện ').run(req);
    // bai viet moi nhat
    // bai-viet-moi-nhat-8569384
    await body('slug').trim().notEmpty().withMessage('Nhập slug ').run(req);
    await body('isApprove').trim().notEmpty().withMessage('Chọn chế độ duyệt').run(req);
    await body('userID').trim().notEmpty().withMessage('Nhập user Id').run(req);
    await body('votes').trim().notEmpty().withMessage('Nhập votes').run(req);

    const check = validationResult(req);
    if (!check.isEmpty()) {
        return res.status(400).json({
            // vì errors trả về một mảng nên destructuring luôn
            message: [
                ...check.errors
            ],
            status: false
        })
    }
    next();
}

export const postById = (req, res, next, id) => {
    PostModel.findById(id).exec((err, post) => {
        if (err || !post) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        req.post = post;
        next();
    })
}