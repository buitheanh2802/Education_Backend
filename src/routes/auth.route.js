import express from 'express';
import { APILimiter, accessToken, accessRole } from 'middlewares/auth.middleware';
import { userValidator,passwordValidator,resetPasswordValidator,resetPasswordConfirmValidator } from 'middlewares/validate.middleware';
import { signup, activeAccount, signin, profile, signout,changeInfoUser, profileDetail,
    getRole, oauthLoginCallback,changePassword,resetPassword,resetPasswordConfirm } from 'controllers/auth.controller';
import passport from 'passport';
import { path } from 'constants/routeDefination';
const router = express.Router();

// signup
router.post(path.auth.signup,
    APILimiter(1, 60),
    userValidator,
    signup
);
//active account
router.get(path.auth.active,
    APILimiter(5, 3600 * 24),
    activeAccount
);
// signin
router.post(path.auth.signin,
    signin
);
// profile 
router.get(path.auth.profile,
    accessToken,
    profile
);
// profile 
router.get(path.auth.getInfoDetail,
    accessToken,
    profileDetail
);
// get role
router.get(path.auth.role,
    accessToken,
    getRole
);
// signout
router.get(path.auth.signout,
    signout
);
// change password
router.post(
    path.auth.changePassword,
    passwordValidator,
    accessToken,
    changePassword
);

// reset password 
router.post(
    path.auth.resetPassword,
    resetPasswordValidator,
    resetPassword
);

// reset password confirm 
router.post(
    path.auth.resetPasswordConfirm,
    resetPasswordConfirmValidator,
    resetPasswordConfirm
);

// change info user
router.post(
    path.auth.changeInfoUser,
    accessToken,
    changeInfoUser
);

// login facebook
router.get(
    path.auth.facebook, 
    passport.authenticate('facebook', { session: false, scope: ['email'] }));
router.get(
    path.auth.facebookCallback, 
    oauthLoginCallback('facebook'));
// login google
router.get(
    path.auth.google, 
    passport.authenticate('google', { session: false }));
router.get(
    path.auth.googleCallback, 
    oauthLoginCallback('google'));
// login github
router.get(
    path.auth.github, 
    passport.authenticate('github', { session: false }));
router.get(
    path.auth.githubCallback, 
    oauthLoginCallback('github'));

export default router;