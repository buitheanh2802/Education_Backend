import express from 'express';
import { APILimiter, accessToken, accessRole } from 'middlewares/auth.middleware';
import { userValidator } from 'middlewares/user.middleware';
import { signup, active, signin, profile } from 'controllers/auth.controller';
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
    active
);
// signin
router.post('/signin', signin);
// profile 
router.get('/profile/me',
    accessToken,
    profile
);


export default router;