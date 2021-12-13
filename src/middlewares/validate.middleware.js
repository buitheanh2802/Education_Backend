import * as pattern from 'constants/regexDefination';
import { response } from 'constants/responseHandler';
import { body, validationResult, param } from 'express-validator';
import mongoose from 'mongoose';

// /userValidator
export const userValidator = async (req, res, next) => {
    await body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống tên của bạn !')
        .isLength({ min: 0, max: 30 })
        .withMessage('Tên của bạn quá dài !')
        .run(req);
    await body('username')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống tên đăng nhập !')
        .matches(pattern.USERNAME)
        .withMessage('Tên đăng nhập không hợp lệ !')
        .run(req);
    await body('email')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống email !')
        .matches(pattern.EMAIL)
        .withMessage('Email không hợp lệ !')
        .run(req)
    await body('password')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống mật khẩu !')
        .matches(pattern.PASSWORD)
        .withMessage('Mật khẩu phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !')
        .run(req);
    const validatorResult = validationResult(req);
    if (!validatorResult.isEmpty()) return response(res, 400, ['INVALID_DATA', ...validatorResult.errors])
    next();
}

// notificationValidator
export const notificationValidator = async (req, res, next) => {
    await body('title')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống tiêu đề...')
        .isLength({ max: 200 })
        .withMessage('Tiêu đề không được dài hơn 50 kí tự')
        .run(req);
    const validatorResult = validationResult(req);
    // điều kiện tồn tại lỗi =>
    if (!validatorResult.isEmpty()) return response(res, 400, ['INVALID_DATA', ...validatorResult.errors])
    // nếu k có lỗi tiến hành next() và cho create 
    next();
}

// postValidator
export const postValidator = async (req, res, next) => {
    await body('title')
        .trim()
        .notEmpty()
        .withMessage('Không được để trống tiêu đề')
        .run(req);
    await body('content')
        .trim()
        .notEmpty()
        .withMessage('Không được để trống nội dung')
        .run(req);
    await body('tags')
        .isArray({ min: 1, max: 5 })
        .withMessage('Chọn tối thiểu 1 thẻ và tối đa 5 thẻ')
        .run(req);
    const validatorResult = validationResult(req);
    if (!validatorResult.isEmpty()) return response(res, 400, ['INVALID_DATA', ...validatorResult.errors])
    next();
}

// comment validator
export const commentUpdateValidator = async (req, res, next) => {
    await body('content').trim()
        .notEmpty()
        .withMessage('Không được để trống nội dung !')
        .run(req);
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
export const commentValidator = async (req, res, next) => {
    await body('content').trim()
        .notEmpty()
        .withMessage('Không được để trống nội dung !')
        .run(req);
    await body('postOrQuestionId').trim()
        .notEmpty()
        .withMessage('Không được để trống ID của bài viết hoặc câu hỏi !')
        .run(req);
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

// feedbackValidator
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

// followValidator
export const followValidator = async (req, res, next) => {
    await param('followingUserId').trim().notEmpty().withMessage("Nhập followingUserId").run(req);
    // await body('userId').trim().notEmpty().withMessage("Nhập userId").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}
//question
export const questionValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage("Nhập title").run(req);
    await body('content').trim().notEmpty().withMessage("Nhập content").run(req);
    await body('tags').notEmpty().withMessage("Nhập tags").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}
export const spamValidator = async (req, res, next) => {
    await body('reason').notEmpty().withMessage("Nhập reason").run(req);
    await body('content').trim().notEmpty().withMessage("Nhập content").run(req);
    await body('referenceTo').notEmpty().withMessage("Nhập ID question or cmt").run(req);
    await body('type').notEmpty().withMessage("Nhập type cmt or question").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}

export const contactValidator = async (req, res, next) => {
    await body('email').notEmpty().withMessage("Nhập email").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}

//challenge
export const challengesValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage("Nhập title").run(req);
    await body('descriptions').trim().notEmpty().withMessage("Nhập descriptions").run(req);
    await body('figmaUrl').notEmpty().withMessage("Nhập link Figma").run(req);
    await body('level').notEmpty().withMessage("Nhập level").run(req);
    await body('challengeCategoryId').notEmpty().withMessage("Nhập Id danh muc").run(req);
    // await body('resourceUrl').notEmpty().withMessage("Nhập link file download").run(req);
    await body('avatar').notEmpty().withMessage("Nhập link avatar").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}
//challenge Categories
export const challengeCategoriesValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage("Nhập title").run(req);
    await body('descriptions').trim().notEmpty().withMessage("Nhập mô tả").run(req);
    await body('avatar').notEmpty().withMessage("Nhập link avatar").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}
// solution validate
export const solutionValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage("Không được bỏ trống tiêu đề").run(req);
    await body('descriptions').trim().notEmpty().withMessage("Không được bỏ trống mô tả").run(req);
    await body('demoUrl').trim().notEmpty().withMessage("Không được bỏ trống link mô tả sản phẩm").run(req);
    await body('repoUrl').trim().notEmpty().withMessage("Không được bỏ trống link source code").run(req);
    await body('challengeId').trim().notEmpty().withMessage("Không được bỏ trống ID thử thách").custom((value, { req }) => {
        const ObjectId = mongoose.Types.ObjectId;
        return ObjectId.isValid(value);
    }).withMessage("ID thử thách không hợp lệ !").run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) {
        return response(res, 400, ['INVALID_DATA', ...check.errors])
    }
    return next();
}

// tag
export const tagValidator = async (req, res, next) => {
    await body('name')
        .trim()
        .notEmpty()
        .withMessage('Không được để trống tên thẻ !')
        .matches(pattern.USERNAME)
        .withMessage('Tên thẻ không hợp lệ !')
        .run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) return response(res, 400, ['INVALID_DATA', ...check.array()]);
    return next();
}
// change password validate
export const passwordValidator = async (req, res, next) => {
    await body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống mật khẩu hiện tại')
        .matches(pattern.PASSWORD)
        .withMessage('Mật khẩu phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !')
        .run(req);
    await body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống mật khẩu mới')
        .matches(pattern.PASSWORD)
        .withMessage('Mật khẩu mới phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !')
        .run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) return response(res, 400, ['INVALID_DATA', ...check.array()]);
    return next();
}
// reset password validate
export const resetPasswordValidator = async (req, res, next) => {
    await body('email')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống email !')
        .matches(pattern.EMAIL)
        .withMessage('Email không hợp lệ !')
        .run(req)
    const check = validationResult(req);
    if (!check.isEmpty()) return response(res, 400, ['INVALID_DATA', ...check.array()]);
    return next();
}
// reset password cofirm validate
export const resetPasswordConfirmValidator = async (req, res, next) => {
    await body('email')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống email !')
        .matches(pattern.EMAIL)
        .withMessage('Email không hợp lệ !')
        .run(req);
    await body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Không được bỏ trống mật khẩu mới')
        .matches(pattern.PASSWORD)
        .withMessage('Mật khẩu mới phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !')
        .run(req);
    const check = validationResult(req);
    if (!check.isEmpty()) return response(res, 400, ['INVALID_DATA', ...check.array()]);
    return next();
}