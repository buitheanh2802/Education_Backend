import express from 'express';
import { APILimiter, accessToken } from 'middlewares/auth.middleware';
import { userValidator } from 'middlewares/user.middleware';
import { signup, activeAccount, signin, profile, signout,getRole } from 'controllers/auth.controller';
const router = express.Router();

// signup
router.post('/signup',
    APILimiter(5, 3600),
    userValidator,
    signup
);
//active account
router.get('/active/:token',
    APILimiter(5, 3600 * 24),
    activeAccount
);
// signin
router.post('/signin', signin);
// profile 
router.get('/profile/me',
    accessToken,
    profile
);
// get role
router.get('/profile/me/role',
    accessToken,
    getRole
);
router.get('/signout',
    signout
);


export default router;