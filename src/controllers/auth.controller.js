import UserModel from './../models/user.model';
import { sendMail } from './../helpers/useMailer';
import _ from 'lodash';
import speakeasy from 'speakeasy';

export const register = async (req, res) => {
    const { email } = req.body
    const generateSecretTOTP = speakeasy.generateSecret({ length: 20 }).base32;
    const OTP = speakeasy.totp({
        secret: generateSecretTOTP,
        encoding: 'base32',
        step: 60
    });
    const document = new UserModel({ ...req.body, secretKey: generateSecretTOTP });
    await sendMail(email, 'Xác thực tài khoản của bạn !', 'verifyEmailTemplate', { OTP })
    document.save((err, docs) => {
        const { email, username, _id } = docs;
        if (err) {
            return res.status(400).json({
                message: [
                    'ERROR_SAVE',
                    err.message
                ],
                status: false
            })
        };
        return res.status(200).json({
            message: [],
            status: true,
            data: { email, username, _id }
        })
    })
}

export const activateOTP = (req, res) => {
    let user = req.user;
    const { otp } = req.body;
    const verifyOTP = speakeasy.totp.verify({
        secret: user.secretKey,
        encoding: 'base32',
        token: otp,
        step: 60
    });
    if (verifyOTP) {
        user = _.assignIn(user, { status: 'active' });
        user.save((err, docs) => {
            if (err) {
                return res.status(400).json({
                    message: [
                        'ERROR_SAVE',
                        err.message
                    ],
                    status: false
                })
            }
            return res.status(200).json({
                message: [],
                data: 'ACTIVATED',
                status: true
            })
        })
    }
    return res.status(401).json({
        message: [
            'INVALID_DATA'
        ],
        status: false
    })
};

export const resendOTP = async (req, res) => {
    const user = req.user;
    const OTP = speakeasy.totp({
        secret: user.secretKey,
        encoding: 'base32',
        step: 60
    });
    await sendMail(user.email, 'Xác thực tài khoản của bạn !', 'verifyEmailTemplate', { OTP });
    res.status(200).json({
        message: [],
        status: true
    })
}