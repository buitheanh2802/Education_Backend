import express from 'express';
import { userValidator, findUserById } from './../middlewares/user.middleware';
import { register, activateOTP, resendOTP } from './../controllers/auth.controller';
import { APILimiter } from './../middlewares/auth.middleware';
const router = express.Router();

// REGISTER
router.post('/register',
    APILimiter(5,3600),
    userValidator,
    register
);

router.post('/activate/:idUser/resend',
    resendOTP
);

router.post('/activate/:idUser',
    activateOTP
);

router.param('idUser', findUserById)


export default router;