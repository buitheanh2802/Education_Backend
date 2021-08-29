import { body, validationResult } from 'express-validator';
import UserModel from './../models/user.model';

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
                .matches(/^(?=[a-zA-Z0-9]{8,20}$)(?!.*[.]{2})[^.].*[^.]$/)
                .withMessage('Tên đăng nhập không hợp lệ !')
                .run(req);
    await body('email')
                .trim()
                .notEmpty()
                .withMessage('Không được bỏ trống email !')
                .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                .withMessage('Email không hợp lệ !')
                .run(req)
    await body('password')
                .trim()
                .notEmpty()
                .withMessage('Không được bỏ trống mật khẩu !')
                .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
                .withMessage('Mật khẩu phải tối thiểu 8 kí tự, ít nhất một chữ cái và một số !')
                .run(req);
    const validatorResult = validationResult(req);
    if(!validatorResult.isEmpty()){
        return res.status(200).json({
            message : [
                'INVALID_DATA',
                ...validatorResult.errors
            ],
            status : false
        })
    }
    next();
}

export const findUserById = (req,res,next,id)=> {
    UserModel.findById(id,(err,docs)=> {
        if(err){
            return res.status(400).json({
                message : [
                    'ERROR_FIND',
                    err.message
                ],
                status : false
            })
        }
        req.user = docs;
        next();
    })
}