import express from 'express';
import { userValidator } from './../middlewares/user.middleware';
import { register } from './../controllers/auth.controller';
const router = express.Router();

// REGISTER
router.post('/register',
    userValidator,
    register
)


export default router;