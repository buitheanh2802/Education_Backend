// các middle liên quan đến phân quyền và token
import expressRateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// set limit for IP and save in RAM memory disk
export const APILimiter = (maxRequestLimit,seconds,message) => {
    // express rate limit is middlewares
    return expressRateLimit({
        max : maxRequestLimit,
        windowMs : 1000 * seconds,
        message : {
            message : [
                ...message
            ],
            status : false
        }
    })
}
    
// phân giải token từ client gửi lên
export const accessToken = (req,res,next) => {
    // const payload = req.authorization
}