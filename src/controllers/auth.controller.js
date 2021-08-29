import UserModel from 'models/user.model';
import { sendMail } from 'services/mailer';
import { response } from 'services/responseHandler';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';


export const signup = async (req, res) => {
    const { fullname, email, username } = req.body;
    const data = new UserModel(req.body);
    data.save(async(err, docs) => {
        if (err) {
            if (err.message.indexOf('username_1') !== -1) return response(res, 400, ['USERNAME_EXIST', err.message])
            if (err.message.indexOf('email_1') !== -1) return response(res, 400, ['EMAIL_EXIST', err.message]);
            return response(res, 500, ['ERROR_SERVER', err.message])
        }
        const token = jwt.sign({ _id : docs._id },process.env.SECRET_KEY,{ expiresIn : 60 * 60})
        await sendMail(email,'Xác thực tài khoản của bạn !','verifyEmailTemplate', { 
            activeUrl : `${process.env.DOMAIN}/api/auth/active/${token}`
        })
        return response(res, 200, [], { fullname, email, username })
    })
}

export const active = (req,res) => {
    const { token } = req.params;
    if(!token) return res.redirect(`${process.env.ACCESS_DOMAIN}/not-found`); 
    try{
        const { _id } = jwt.verify(token,process.env.SECRET_KEY);
        UserModel.findOne({ _id },(err,docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if(docs.status == 'active') return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true&reactive=true`) 
            const newData = _.assignIn(docs,{ status : 'active' });
            newData.save((err,docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true`)
            })
        })
    }catch(err){
        return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=false`)
    }
}