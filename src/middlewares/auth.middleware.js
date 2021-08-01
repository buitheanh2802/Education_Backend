// các middle liên quan đến phân quyền và token
import expressRateLimit from 'express-rate-limit';

export const apiLimiter = expressRateLimit({
    max : 1,
    windowMs : 1000 * 20,
    message : 'Đẩy cc gì nhiều thế'
})