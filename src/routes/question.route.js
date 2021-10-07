import { path } from 'constants/routeDefination';
import { addDislike, addLike, create, get, gets, remove, removeDislike, removeLike, update } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { questionValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.get(path.question.gets, gets);
router.get(path.question.get, get);
router.post(path.question.post, questionValidator, accessToken, create);
router.put(path.question.put, questionValidator, accessToken, update);
router.delete(path.question.delete, accessToken, remove);

router.post(path.question.like, accessToken, addLike);
router.delete(path.question.deletelike, accessToken, removeLike);

router.post(path.question.dislike, accessToken, addDislike);
router.delete(path.question.deletedislike, accessToken, removeDislike);

export default router;