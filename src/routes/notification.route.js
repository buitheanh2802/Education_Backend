import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { create, gets, update, remove } from 'controllers/notification.controller';
import { path } from 'constants/routeDefination';
import { notificationValidator } from 'middlewares/validate.middleware';
import NotificationModel from "models/notification.model";
import { pagination } from 'middlewares/query.middleware';
// init router
const router = express.Router();
router.get(path.notification.gets,
    accessToken,
    pagination(NotificationModel, 5, '-type', { sendTo: 'req.userId' }),
    gets
);
router.post(path.notification.post,
    notificationValidator,
    accessToken,
    create
);
router.put(path.notification.put,
    accessToken,
    update
);
router.delete(path.notification.delete,
    accessToken,
    remove
);

export default router;
