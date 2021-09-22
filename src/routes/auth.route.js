import express from 'express';
import { APILimiter, accessToken, accessRole } from 'middlewares/auth.middleware';
import { userValidator } from 'middlewares/validate.middleware';
import { signup, activeAccount, signin, profile, signout, getRole, oauthLoginCallback } from 'controllers/auth.controller';
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
// get role
router.get(path.auth.role,
    accessToken,
    getRole
);
router.get(path.auth.signout,
    signout
);
// login facebook
router.get(path.auth.facebook, passport.authenticate('facebook', { session: false,scope : ['email'] }));
router.get(path.auth.facebookCallback, oauthLoginCallback('facebook'))


export default router;