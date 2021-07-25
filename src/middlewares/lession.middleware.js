import { body,validationResult } from 'express-validator';


// thêm các middleware sử lí nhằm giảm tải cho controller dữ liệu sau này lớn lên sẽ khó kiểm soát
export const lessionValidator = async(req,res,next) => {
    await body('title').trim().notEmpty().withMessage('Nhập tiêu đề').run(req);
    await body('linkLession').trim().notEmpty().withMessage('Nhập link ').run(req);
    await body('courseID').trim().notEmpty().withMessage('Nhập ID course').run(req);

    const check = validationResult(req);
    // điều kiện tồn tại lỗi =>
    if(!check.isEmpty()){
        return res.status(400).json({
            message : 'validate error',
            error : check.errors
        })
    }
    // nếu k có lỗi tiến hành next() và cho create 
    next()
}