import { path } from 'constants/routeDefination';
import { detailSpamComment, detailSpamQuestion, getListSpamCmt, getListSpamQuestion, spamQuestionOrCmt } from 'controllers/spam.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { spamValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.post(path.spam.questionOrCmt, accessToken, spamValidator, spamQuestionOrCmt)
router.get(path.spam.listQuestion, accessToken, getListSpamQuestion)
router.get(path.spam.listCmt, accessToken, getListSpamCmt)
router.get(path.spam.detailQuestion, accessToken, detailSpamQuestion)
router.get(path.spam.detailCmt, accessToken, detailSpamComment)

export default router;