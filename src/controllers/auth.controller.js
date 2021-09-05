import UserModel from 'models/user.model';
import { sendMail } from 'services/mailer';
import { response } from 'services/responseHandler';
import { createFolder } from 'services/drive';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';


export const signup = async (req, res) => {
    const { fullname, email, username } = req.body;
    const data = new UserModel(req.body);
    data.save(async (err, docs) => {
        if (err) {
            if (err.message.indexOf('username_1') !== -1) return response(res, 400, ['USERNAME_EXIST', err.message])
            if (err.message.indexOf('email_1') !== -1) return response(res, 400, ['EMAIL_EXIST', err.message]);
            return response(res, 500, ['ERROR_SERVER', err.message])
        }
        const token = jwt.sign({ _id: docs._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 })
        await sendMail(email, 'Xác thực tài khoản của bạn !', 'verifyEmailTemplate', {
            activeUrl: `${process.env.DOMAIN}/api/auth/active/${token}`
        });
        const driveFolder = await createFolder(docs.username, '1PWS1iJLKp02kOGGQ-o2WwFYFQE8E6Scs');
        docs.driveId = driveFolder.id;
        await docs.save();
        return response(res, 200, [], { fullname, email, username })
    })
}

export const activeAccount = (req, res) => {
    const { token } = req.params;
    if (!token) return res.redirect(`${process.env.ACCESS_DOMAIN}/not-found`);
    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        UserModel.findOne({ _id }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (docs.status == 'active') return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true&reactive=true`)
            const activeUser = _.assignIn(docs, { status: 'active' });
            activeUser.save((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true`)
            })
        })
    } catch (err) {
        return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=false`)
    }
}

export const signin = (req, res) => {
    console.log(req.cookies);
    passport.authenticate('local', (err, profile) => {
        const { email, password: passwordRequest } = profile;
        UserModel.findOne({ email }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMAIL_NOTEXIST']);
            if (!docs.verifyPassword(passwordRequest)) return response(res, 400, ['INVALID_PASSWORD']);
            const token = jwt.sign({ _id: docs._id, driveId: docs.driveId }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
            if (docs.status == 'verify') {
                return response(res, 400, ['NOT_VERIFY'])
            }
            res.cookie('auth_tk', token, { httpOnly: true, maxAge: 1000 * 60 * 60,domain : '' ,sameSite : 'None'})
            return response(res, 200, [], {
                username: docs.username,
                email: docs.email,
                fullname: docs.fullname,
                avatar: docs.avatar,
                birthday: docs.birthday,
                address: docs.address,
                phoneNumber: docs.phoneNumber
            })
        })
    })(req, res);
}

export const profile = (req, res) => {
    UserModel.findOne({ _id: req.userId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['USER_NOTEXIST']);
        // const token = jwt.sign({ _id: docs._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
        // res.cookie('AUTH_TOKEN', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
        return response(res, 200, [], {
            username: docs.username,
            email: docs.email,
            fullname: docs.fullname,
            avatar: docs.avatar,
            birthday: docs.birthday,
            address: docs.address,
            phoneNumber: docs.phoneNumber
        })
    })
}

export const getRole = (req, res) => {
    UserModel
        .findOne({ _id: req.userId })
        .select('role -_id')
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['USER_NOTEXIST']);
            return response(res, 200, [], { ...docs })
        })
}

export const signout = (req, res) => {
    res.clearCookie('auth_tk');
    return response(res, 200, []);
}