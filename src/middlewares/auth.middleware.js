import expressRateLimit from 'express-rate-limit';
import { response } from 'services/responseHandler';
import userModel from 'models/user.model';
import jwt from 'jsonwebtoken';
// set limit for IP and save in RAM memory disk
export const APILimiter = (maxRequestLimit, seconds) => {
    // express rate limit is middlewares
    return expressRateLimit({
        max: maxRequestLimit,
        windowMs: 1000 * seconds,
        message: {
            message: [
                'LIMITED_REQUEST'
            ],
            status: false,
            maxLimit: maxRequestLimit,
            expired: `${seconds}s`
        }
    })
}
export const accessToken = (req, res, next) => {
    const token = req.cookies['AUTH_TOKEN'];
    if (!token) return response(res, 400, ['EMPTY_TOKEN']);
    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = _id;
        return next();
    } catch (error) {
        return response(res, 400, ['EXPIRED_TOKEN']);
    }
}

export const accessRole = (...acceptRoles) => {
    const roleDefine = ['user','admin','collaborators'];
    return (req,res,next) => {
        userModel.findById(req.userId,(err,docs) => {
            if(err) return response(res,500,['ERROR_SERVER']);
            const isAccept = acceptRoles.includes(docs.role);
            if(isAccept) return next();
            else return response(res,401,['ACCESS_DENIED'])
        })
    }
}