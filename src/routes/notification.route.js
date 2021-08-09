import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/notification.controller';
import { notificationById, notificationValidator, pagination } from '../middlewares/notification.middleware';
// init router
const router = express.Router();

router.post('/', notificationValidator, create);
router.get('/:notificationId', read);
router.put('/:notificationId', notificationValidator, update);
router.delete('/:notificationId', remove);

router.get('/',
    pagination, 
    fetchAll
);

router.param('notificationId', notificationById);

export default router;
