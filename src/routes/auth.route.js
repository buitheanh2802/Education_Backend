import express from 'express';
const router = express.Router();

// // REGISTER
// router.post('/register',
//     APILimiter(5,3600),
//     userValidator,
//     register
// );

// router.post('/activate/:idUser/resend',
//     resendOTP
// );

// router.post('/activate/:idUser',
//     activateOTP
// );

// router.param('idUser', findUserById)


export default router;