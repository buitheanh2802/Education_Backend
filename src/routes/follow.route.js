import { path } from 'constants/routeDefination';
import { create, remove } from 'controllers/follow.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';
import { followValidator } from 'middlewares/validate.middleware';


const router = express.Router();

router.post(path.follow.post, followValidator, accessToken, create);
router.delete(path.follow.delete, accessToken, remove);

export default router;