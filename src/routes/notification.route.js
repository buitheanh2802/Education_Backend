import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { create, gets, read, remove, update } from '../controllers/notification.controller';
import { notificationById, notificationValidator, pagination } from '../middlewares/notification.middleware';
// init router
const router = express.Router();

router.get('/',
    // accessToken,
    pagination,
    gets
);


export default router;
