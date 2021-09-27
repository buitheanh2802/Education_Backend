import { path } from 'constants/routeDefination';
import { create, gets } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

router.get(path.question.gets, accessToken, gets);
router.post(path.question.post, accessToken, create);

export default router;