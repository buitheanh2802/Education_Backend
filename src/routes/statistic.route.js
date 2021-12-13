import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
const router = express.Router();
import { path } from 'constants/routeDefination';
import { getsPost, getsQuestion, getSolutions, totalUploadDownloadChallenge, getUser, totalUser } from 'controllers/statistic.controller';

router.post(path.statistic.question, accessToken, getsQuestion);
router.post(path.statistic.post, accessToken, getsPost);
router.post(path.statistic.solutions, accessToken, getSolutions);
router.post(path.statistic.users, accessToken, getUser);
router.post(path.statistic.totalUser, accessToken, totalUser);
router.post(path.statistic.totalUploadDownloadChallenge, accessToken, totalUploadDownloadChallenge);


export default router;