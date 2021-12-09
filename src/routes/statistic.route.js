import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
const router = express.Router();
import { path } from 'constants/routeDefination';
import { getsPost, getsQuestion } from 'controllers/statistic.controller';

router.post(path.statistic.question, accessToken, getsQuestion);
router.post(path.statistic.post, accessToken, getsPost);


export default router;