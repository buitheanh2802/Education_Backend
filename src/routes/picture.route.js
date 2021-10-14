import { path } from 'constants/routeDefination';
import { create, gets, remove } from 'controllers/picture.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

router.post(path.picture.post, accessToken, create);
router.get(path.picture.gets, accessToken, gets);
router.delete(path.picture.delete, accessToken, remove);

export default router;