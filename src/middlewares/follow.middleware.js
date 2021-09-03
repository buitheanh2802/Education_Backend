import FollowModel from '../models/follow.model';
import { body, validationResult } from 'express-validator';

export const followValidator = async (req, res, next) => {

    await body('followingUserId').trim().notEmpty().withMessage('Nhập followingUserId').run(req);
    await body('userId').trim().notEmpty().withMessage('Nhập userId').run(req);

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

export const followById = (req, res, next, id) => {
    FollowModel.findById(id).exec((err, follow) => {
        if (err || !follow) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        req.follow = follow;
        next();
    })
}