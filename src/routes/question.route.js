import { path } from 'constants/routeDefination';
import { create, get, gets, remove, update } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { questionValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.get(path.question.gets, accessToken, gets);
router.get(path.question.get, accessToken, get);
router.post(path.question.post, questionValidator, accessToken, create);
router.put(path.question.put, questionValidator, accessToken, update);
router.delete(path.question.delete, accessToken, remove);

export default router;