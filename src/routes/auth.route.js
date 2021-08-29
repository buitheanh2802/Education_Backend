import express from 'express';
import { APILimiter } from 'middlewares/auth.middleware';
import { userValidator } from 'middlewares/user.middleware';
import { signup,active } from 'controllers/auth.controller';
const router = express.Router();

// signup
router.post('/signup',
    APILimiter(5,3600),
    userValidator,
    signup
);
//active account
router.get('/active/:token',
    APILimiter(5,3600 * 24),
    active
);


export default router;