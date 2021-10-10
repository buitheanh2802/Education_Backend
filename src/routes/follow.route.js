import { path } from 'constants/routeDefination';
import { create, remove } from 'controllers/follow.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';


const router = express.Router();

router.post(path.follow.post, accessToken, create);
router.delete(path.follow.delete, accessToken, remove);

export default router;