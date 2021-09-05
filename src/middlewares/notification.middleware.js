import { body, validationResult } from 'express-validator';
import notificationModel from 'models/notification.model';
import { response } from 'services/responseHandler';


// thêm các middleware sử lí nhằm giảm tải cho controller dữ liệu sau này lớn lên sẽ khó kiểm soát
export const notificationValidator = async (req, res, next) => {
    await body('title')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống tiêu đề...')
        .isLength({ max: 50 })
        .withMessage('Tiêu đề không được dài hơn 50 kí tự')
        .run(req);
    await body('url')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống URL...')
        .isLength({ max: 50 })
        .withMessage('URL không được dài hơn 50 kí tự')
        .run(req);
    await body('sendTo')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống người nhận.... ')
        .isLength({ max: 20 })
        .withMessage('Người nhận là ID và không được dài hơn 20 kí tự')
        .run(req);
    const check = validationResult(req);
    // điều kiện tồn tại lỗi =>
    if (!check.isEmpty()) {
        return res.status(400).json({
            message: 'validate error',
            error: check.errors
        })
    }
    // nếu k có lỗi tiến hành next() và cho create 
    next();
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

export const pagination = async (req, res, next) => {
    const limit = 5;
    const pattern = /^[1-9]+$/;
    let { page } = req.query;
    if (!page) return next();
    if (!pattern.test(page)) page = 1;
    const skip = (page - 1) * limit;
    const totalNotification = await notificationModel.countDocuments({ sendTo: req.userId });
    const totalPage = Math.ceil(totalNotification / limit);
    notificationModel.find({ sendTo: req.userId })
        .skip(skip)
        .limit(limit)
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER']);
            return response(res, 200, [],
                {
                    notifications: docs,
                    metaData: {
                        pagination: {
                            perPage: limit,
                            totalPage: totalPage,
                            currentPage: page,
                            countDocument: docs.length
                        }
                    }
                });
        })
}