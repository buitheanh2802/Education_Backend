import express from 'express';
import { APILimiter, accessToken } from 'middlewares/auth.middleware';
import { userValidator } from 'middlewares/validate.middleware';
import { signup, activeAccount, signin, profile, signout, getRole } from 'controllers/auth.controller';
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


export default router;