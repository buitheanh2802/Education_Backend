import { path } from 'constants/routeDefination';
import { create, fetchAll, read, remove } from 'controllers/follow.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { followValidator } from 'middlewares/validate.middleware';


const router = express.Router();

router.post(path.follow.post, followValidator, accessToken, create);
router.delete(path.follow.delete, accessToken, remove);
// router.get('/:followId', read);
router.get('/', fetchAll)
// router.post('/', followValidator, create)
// router.put('/:postId', postValidator, update)
// router.delete('/:followId', remove)

// router.param('followId', followById)

export default router;