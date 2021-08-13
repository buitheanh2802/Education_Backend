import { body, validationResult } from "express-validator";
import CategoryExerciseModel from './../models/categoryExercise.model';

export const categoryExerciseValidator = async (req, res, next) => {
    await body('title').trim().notEmpty().withMessage("Nhập tiêu đề").run(req);
    await body('content').trim().notEmpty().withMessage("Nhập nội dung").run(req);

    const check = validationResult(req);
    if (!check.isEmpty()) {
        return res.status(400).json({
            message: 'validate error',
            error: check.errors
        })
    }
    next()
}

export const categoryExerciseById = (req, res, next, id) => {
    CategoryExerciseModel.findById(id).exec((err, categoryExercise) => {
        if (err || !categoryExercise) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        req.categoryExercise = categoryExercise;
        next();
    })
}




