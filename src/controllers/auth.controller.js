import UserModel from 'models/user.model';
import { sendMail } from 'services/mailer';
import { response } from 'constants/responseHandler';
import { createFolder } from 'services/drive';
import { randomNumber, toSlug } from 'constants/shared';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';


export const signup = async (req, res) => {
    const { fullname, email, username } = req.body;
    const data = new UserModel(req.body);
    const checkEmail = await UserModel.findOne({ email: email, socialType: 'system' });
    if (checkEmail) return response(res, 400, ['EMAIL_EXIST', err.message]);
    data.save(async (err, docs) => {
        if (err) {
            if (err.message.indexOf('username_1') !== -1) return response(res, 400, ['USERNAME_EXIST', err.message]);
        }
        try {
            const token = jwt.sign({ _id: docs._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 })
            await sendMail(email, 'Xác thực tài khoản của bạn !', 'verifyEmailTemplate', {
                activeUrl: `${process.env.DOMAIN}/api/auth/active/${token}`
            });
            const driveFolder = await createFolder(docs.username, '1PWS1iJLKp02kOGGQ-o2WwFYFQE8E6Scs');
            docs.driveId = driveFolder.id;
            await docs.save();
            return response(res, 200, [], { fullname, email, username })
        } catch (error) {
            return response(res, 500, ['ERROR_SERVER', error.message])
        }
    })
}

export const activeAccount = (req, res) => {
    const { token } = req.params;
    if (!token) return res.redirect(`${process.env.ACCESS_DOMAIN}/not-found`);
    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        UserModel.findOne({ _id }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (docs.status == 'active') return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true&reactive=true`);
            const activeUser = _.assignIn(docs, { status: 'active' });
            activeUser.save((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=true`)
            })
        });
    } catch (err) {
        return res.redirect(`${process.env.ACCESS_DOMAIN}/?activated=false`)
    }
}

export const signin = (req, res) => {
    passport.authenticate('local', (err, profile) => {
        const { email, password: passwordRequest } = profile;
        UserModel.findOne({ email, socialType: 'system' },'-_id -createdAt -updatedAt -driveId -status -__v -socialType ', (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMAIL_NOTEXIST']);
            if (!docs.verifyPassword(passwordRequest)) return response(res, 400, ['INVALID_PASSWORD']);
            const token = jwt.sign({ _id: docs._id, driveId: docs.driveId }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
            if (docs.status == 'verify') {
                return response(res, 400, ['NOT_VERIFY'])
            }
            const documentReponse = docs.toObject({ transform : (_,pureObject) => {
                delete pureObject.password
                return pureObject;
            }});
            // res.cookie('auth_tk', token, { maxAge: 1000 * 60 * 60,sameSite : 'None',secure : true})
            return response(res, 200, [], {
                profile: {
                    ...documentReponse,
                    role: docs.role !== 'user' ? docs.role : undefined,
                    userType : docs.userType !== 'basic' ? docs.userType : undefined
                },
                token: token
            })
        })
    })(req, res);
}

export const profile = (req, res) => {
    UserModel
        .findOne({ _id: req.userId }, '-_id -createdAt -updatedAt -driveId -password -status -__v -socialType ')
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['USER_NOTEXIST']);
            return response(res, 200, [],
                {
                    ...docs,
                    role: docs.role !== 'user' ? docs.role : undefined,
                    userType : docs.userType !== 'basic' ? docs.userType : undefined
                })
        })
}

export const getRole = (req, res) => {
    UserModel
        .findOne({ _id: req.userId })
        .select('role -_id')
        .exec((err, docs) => {
            const data = docs.toObject();
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['USER_NOTEXIST']);
            return response(res, 200, [], { ...data })
        })
}

export const signout = (req, res) => {
    res.clearCookie('auth_tk');
    return response(res, 200, []);
}

export const oauthLoginCallback = (strategy) => {
    return (req, res) => {
        passport.authenticate(strategy, (err, profile) => {
            console.log(profile);
            console.log(err);
            if (err) return res.redirect(`${process.env.ACCESS_DOMAIN}/auth/login?authenticate=false`);
            UserModel.findOne({ email: profile.emails[0].value, socialType: strategy })
                .lean()
                .exec(async (err, docs) => {
                    let currentUser = docs;
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    if (!docs) {
                        const driveFolder = await createFolder(toSlug(profile.displayName).concat(randomNumber()), '1PWS1iJLKp02kOGGQ-o2WwFYFQE8E6Scs');
                        const createUser = new UserModel({
                            email: profile.emails[0].value,
                            socialType: strategy,
                            fullname: profile.displayName,
                            username: toSlug(profile.displayName).concat(randomNumber()),
                            driveId: driveFolder.id,
                            status: 'active'
                        });
                        currentUser = await createUser.save();
                    }
                    const token = jwt.sign({
                        _id: currentUser._id,
                        driveId: currentUser.driveId,
                        oauthPicture: profile.photos[0].value
                    }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                    return res.redirect(`${process.env.ACCESS_DOMAIN}/auth/login?authenticate=true&token=${token}`);
                })
        })(req, res)
    }
}