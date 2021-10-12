import { path } from 'constants/routeDefination';
import { create } from 'controllers/picture.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

router.post(path.picture.post, accessToken, create);

export default router;