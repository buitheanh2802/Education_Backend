import { body, validationResult } from 'express-validator';
import NotificationModel from '../models/notification.model';
import _ from 'lodash'


// thêm các middleware sử lí nhằm giảm tải cho controller dữ liệu sau này lớn lên sẽ khó kiểm soát
export const notificationValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage('Nhập tiêu đề').run(req);
    await body('content').trim().notEmpty().withMessage('Nhập nội dung ').run(req);
    await body('type').trim().notEmpty().withMessage('Nhập loại ').run(req);
    await body('userID').trim().notEmpty().withMessage('Nhập ID user').run(req);

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

export const notificationById = (req, res, next, id) => {
    NotificationModel.findById(id).exec((err, notification) => {
        if (err || !notification) {
            res.status(400).json({
                error: "Không tìm thông báo"
            })
        }
        req.notification = notification;
        next();
    })
}