import UserModel from './../models/user.model';
import { sendMail } from './../helpers/useMailer';
import _ from 'lodash';
import speakeasy from 'speakeasy';

export const register = async(req,res) => {
    const generateSecretTOTP = speakeasy.generateSecret({ length : 20 }).base32;
    const OTP = speakeasy.totp({
        secret : generateSecretTOTP,
        encoding : 'base32',
        step : 60
    });
    const document = new UserModel({...req.body,secretKey : generateSecretTOTP});
    await sendMail('anhbtph12413@fpt.edu.vn','Xác thực tài khoản của bạn !','verifyEmailTemplate',{ OTP })
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

export const activateOTP = (req,res) => {
    const user = req.user;
    const { otp } = req.body;
    console.log(otp);
    const verifyOTP = speakeasy.totp.verify({
        secret : user.secretKey,
        encoding : 'base32',
        token : otp,
        step : 60
    });
    console.log(verifyOTP);
    if(verifyOTP){
        
    }
    return res.status(401).json({
        message : [
            'INVALID_DATA'
        ],
        status : false
    })
};

export const resendOTP = async(req,res) => {
    const user = req.user;
    const OTP = speakeasy.totp({
        secret : user.secretKey,
        encoding : 'base32',
        step : 60
    });
    await sendMail('anhbtph12413@fpt.edu.vn','Xác thực tài khoản của bạn !','verifyEmailTemplate',{ OTP });
    res.status(200).json({
        message : [],
        status : true
    }) 
}