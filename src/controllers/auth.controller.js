import UserModel from './../models/user.model';
import { sendMail } from './../helpers/useMailer';
import speakeasy from 'speakeasy';

export const register = async(req,res) => {
    const generateSecretTOTP = speakeasy.generateSecret({ length : 20 }).base32;
    const OTP = speakeasy.totp({
        secret : generateSecretTOTP,
        encoding : 'base32',
        step : 60
    })
    const document = new UserModel({...req.body,secretKey : generateSecretTOTP});
    try {
        await sendMail('anhbtph12413@fpt.edu.vn',
                        'Xác thực tài khoản của bạn !',
                        'verifyEmailTemplate',
                        { OTP }
                    )
    } catch (error) { 
        console.log(error.message);
    }
    document.save((err,docs) => {
        if(err){
            return res.status(400).json({
                message : [
                    'ERROR_SAVE',
                    err.message
                ],
                status : false
            })
        };
        return res.status(200).json({
            message : [],
            status : true,
            data : docs
        })
    })
}