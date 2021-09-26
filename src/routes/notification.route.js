import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { create, gets, update, remove,readAll } from 'controllers/notification.controller';
import { path } from 'constants/routeDefination';
import { notificationValidator } from 'middlewares/validate.middleware';
// init router
const router = express.Router();
// gets
router.get(path.notification.gets,
    accessToken,
    gets
);
//read All
router.post(path.notification.readall,
    accessToken,
    readAll
);
// post
router.post(path.notification.post,
    notificationValidator,
    accessToken,
    create
);
// put
router.put(path.notification.put,
    accessToken,
    update
);
// delete
router.delete(path.notification.delete,
    accessToken,
    remove
);

export default router;
