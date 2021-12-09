import UserModel from 'models/user.model';
import { sendMail } from 'services/mailer';
import { response } from 'constants/responseHandler';
import { createFolder } from 'services/drive';
import { randomNumber, toSlug } from 'src/helpers/slug';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';
import { jsonDecode, jsonEncode } from 'services/system';
import FollowModel from 'models/follow.model';

// global variables
const expiredToken = 60 * 60 * 24;
// end

export const signup = async (req, res) => {
    const { fullname, email, username } = req.body;
    const data = new UserModel(req.body);
    const checkEmail = await UserModel.findOne({ email: email, socialType: 'system' });
    if (checkEmail) return response(res, 400, ['EMAIL_EXIST']);
    data.save(async (err, docs) => {
        if (err) {
            if (err.message.indexOf('username_1') !== -1) return response(res, 400, ['USERNAME_EXIST', err.message]);
        }
        try {
            const token = jwt.sign({ _id: docs._id }, process.env.SECRET_KEY, { expiresIn: expiredToken })
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
        // console.log('run');
        UserModel.findOne({ email, socialType: 'system' }, '-hobbies -skills -address -phoneNumber -birthday -descriptions -createdAt -updatedAt -__v ', (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMAIL_NOTEXIST']);
            if (!docs.verifyPassword(passwordRequest)) return response(res, 400, ['INVALID_PASSWORD']);
            const token = jwt.sign({ _id: docs._id, driveId: docs.driveId }, process.env.SECRET_KEY, { expiresIn: expiredToken });
            if (docs.status == 'verify') {
                return response(res, 400, ['NOT_VERIFY'])
            }
            const documentReponse = docs.toObject({
                transform: (_, pureObject) => {
                    delete pureObject.password;
                    delete pureObject.driveId;
                    delete pureObject.status;
                    return pureObject;
                }
            });
            const tokenRefresh = jwt.sign({ _id: docs._id, driveId: docs.driveId }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 * 7 });
            res.cookie('ft', tokenRefresh, { maxAge: 1000 * 60 * 60 * 24 * 7 ,sameSite : 'None',secure : true})
            return response(res, 200, [], {
                profile: {
                    ...documentReponse,
                    role: docs.role !== 'user' ? docs.role : undefined,
                    userType: docs.userType !== 'basic' ? docs.userType : undefined
                },
                token: token
            })
        })
    })(req, res);
}


export const profile = (req, res) => {
    UserModel
        .findOne({ _id: req.userId }, `-hobbies -skills -address -phoneNumber -birthday -descriptions -createdAt -updatedAt -driveId -password -status -__v `)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['USER_NOTEXIST']);
            if(req?.oauthPicture) docs.avatar.avatarUrl = req.oauthPicture;
            return response(res, 200, [],
                {
                    ...docs,
                    role: docs.role !== 'user' ? docs.role : undefined,
                    userType: docs.userType !== 'basic' ? docs.userType : undefined
                })
        })
}

export const profileDetail = (req, res) => {
    UserModel
        .findOne({ _id: req.userId }, `-createdAt -updatedAt -driveId -password -status -__v `)
        .populate([
            { path: 'questionCounts' },
            { path: 'postCounts' },
            { path: 'followers' }
        ])
        .lean()
        .exec(async(err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['USER_NOTEXIST']);
            const followingCounts = await FollowModel.countDocuments({ userId: req.userId })
            return response(res, 200, [],
                {
                    ...docs,
                    followers: docs.followers?.length || 0,
                    followingCounts : followingCounts,
                    role: docs.role !== 'user' ? docs.role : undefined,
                    userType: docs.userType !== 'basic' ? docs.userType : undefined
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
    res.clearCookie('ft');
    return response(res, 200, []);
}

export const oauthLoginCallback = (strategy) => {
    return (req, res) => {
        passport.authenticate(strategy, (err, profile) => {
            // console.log(profile);
            // console.log(err);
            if (err) return res.redirect(`${process.env.ACCESS_DOMAIN}/auth/login?authenticate=false`);
            UserModel.findOne({ email: profile.emails[0].value, socialType: strategy })
                .lean()
                .exec(async (err, docs) => {
                    let currentUser = docs;
                    if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                    if (!docs) {
                        const driveFolder = await createFolder(toSlug(profile.displayName, '').concat(randomNumber()), '1PWS1iJLKp02kOGGQ-o2WwFYFQE8E6Scs');
                        const createUser = new UserModel({
                            email: profile.emails[0].value,
                            socialType: strategy,
                            fullname: profile.displayName,
                            username: toSlug(profile.displayName, '').concat(randomNumber()),
                            driveId: driveFolder.id,
                            status: 'active'
                        });
                        currentUser = await createUser.save();
                    }
                    const token = jwt.sign({
                        _id: currentUser._id,
                        driveId: currentUser.driveId,
                        oauthPicture: profile.photos[0].value
                    }, process.env.SECRET_KEY, { expiresIn: expiredToken });
                    const tokenRefresh = jwt.sign({
                        _id: currentUser._id,
                        driveId: currentUser.driveId,
                        oauthPicture: profile.photos[0].value
                    }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 * 7 });
                    res.cookie('ft', tokenRefresh, { maxAge: 1000 * 60 * 60 * 24 * 7 ,sameSite : 'None',secure : true})
                    return res.redirect(`${process.env.ACCESS_DOMAIN}/auth/login?authenticate=true&token=${token}`);
                })
        })(req, res)
    }
}

export const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (currentPassword == newPassword) return response(res, 400, ['SAME_PASSWORD']);
    UserModel.findOne({ _id: req.userId, socialType: 'system' }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['USER_NOTEXIST']);
        if (!docs.verifyPassword(currentPassword)) return response(res, 400, ['CURRENT_PASSWORD_INCORRECT']);
        const changePassword = _.assignIn(docs, { password: newPassword });
        changePassword.save((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, []);
        })
    })
}

export const resetPassword = (req, res) => {
    const { email } = req.body;
    UserModel
        .findOne({ email: email, socialType: 'system' })
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMAIL_NOTEXIST']);
            const token = jsonEncode({ _id: docs._id, password: docs.password });
            await sendMail(email, 'Đặt lại mật khẩu của bạn !', 'resetPasswordTempate', {
                activeUrl: `${process.env.ACCESS_DOMAIN}/auth/reset_password/${token}`,
                layout: 'resetPasswordTempate'
            });
            return response(res, 200, []);
        })
}

export const resetPasswordConfirm = (req, res) => {
    const { email, token, newPassword } = req.body;
    try {
        const userInfo = jsonDecode(token);
        UserModel.findOne({
            _id: userInfo._id,
            socialType: 'system',
            email
        })
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!docs) return response(res, 400, ['USER_NOTEXIST']);
                if (userInfo.password == docs.password) {
                    const resetPassword = _.assignIn(docs, { password: newPassword });
                    resetPassword.save((err, docs) => {
                        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                        return response(res, 200, []);
                    })
                } else return response(res, 401, ['EXPIRED_TOKEN']);
            })
    } catch (error) {
        return response(res, 401, ['EXPIRED_TOKEN']);
    }
}

export const changeInfoUser = (req, res) => {
    const { fullname, username, email, password, points, role, status, driveId, socialType, ...rest } = req.body;
    UserModel.updateOne({ _id: req.userId }, rest, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (docs.n == 0) return response(res, 400, ['ACCESS_DENIED']);
        return response(res, 200, []);
    })
}

// refresh token 
export const refreshToken = (req, res) => {
    const getToken = req.cookies['ft'];
    if (!getToken) {
        res.clearCookie('ft');
        return response(res, 400, ['EMPTY_TOKEN']);
    }
    try {
        const { iat,exp,...allData } = jwt.verify(getToken, process.env.SECRET_KEY);
        // console.log(allData);
        const token = jwt.sign(allData, process.env.SECRET_KEY, { expiresIn: expiredToken });
        return response(res, 200, [], token );
    } catch (error) {
        res.clearCookie('ft');
        // console.log(error.message);
        return response(res, 400, ['EXPIRED_TOKEN']);
    }
}