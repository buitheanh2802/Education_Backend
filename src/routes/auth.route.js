import express from 'express';
import { userValidator, findUserById } from './../middlewares/user.middleware';
import { register, activateOTP, resendOTP } from './../controllers/auth.controller';
const router = express.Router();

// REGISTER
router.post('/register',
    userValidator,
    register
);

router.get('/activate/:idUser/resend',
    resendOTP
);

router.post('/activate/:idUser',
    activateOTP
);

router.param('idUser', findUserById)


export default router;