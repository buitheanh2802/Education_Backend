import { body, validationResult } from 'express-validator';
import NotificationModel from '../models/notification.model';
import _ from 'lodash'


// thêm các middleware sử lí nhằm giảm tải cho controller dữ liệu sau này lớn lên sẽ khó kiểm soát
export const notificationValidator = async (req, res, next) => {
    await body('title')
                .trim()
                .notEmpty()
                .withMessage('Không được bỏ trống tiêu đề...')
                .isLength({ max : 50 })
                .withMessage('Tiêu đề không được dài hơn 50 kí tự')
                .run(req);
    await body('url')
                .trim()
                .notEmpty()
                .withMessage('Không được bỏ trống URL...')
                .isLength({ max : 50 })
                .withMessage('URL không được dài hơn 50 kí tự')
                .run(req);
    await body('type').trim().notEmpty().withMessage('Nhập loại ').run(req);
    await body('userID').trim().notEmpty().withMessage('Nhập ID user').run(req);
    await body('path').trim().notEmpty().withMessage('Nhập link').run(req);
    await body('status').trim().notEmpty().withMessage('Chọn tình trạng').run(req);

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
                message: [
                    err.message
                ],
                status: false
            })
        }
        req.notification = notification;
        next();
    })
}

export const pagination = (req, res, next) => {
    // ?_limit=10&_page=0
    //[{},{},{},{},{}]
    const { _page, _limit } = req.query;
    const currentSkip = _page * _limit // => 1 * 8
    if (_page && _limit) {
        NotificationModel
            .find({})
            .limit(_limit)
            .skip(currentSkip)
            .exec((err, docs) => {
                return res.status(200).json({
                    data: docs
                })
            })
    }
    else {
        return next()
    }
}