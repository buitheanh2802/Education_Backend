import { path } from 'constants/routeDefination';
import { addBookmark, addDislike, addLike, create, delBookmark, get, gets, listBookmark, remove, removeDislike, removeLike, searchTag, update } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { questionValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.get(path.question.listbookmark, accessToken, listBookmark);

router.get(path.question.gets, gets);
router.get(path.question.get, get);
router.post(path.question.post, questionValidator, accessToken, create);
router.put(path.question.put, questionValidator, accessToken, update);
router.delete(path.question.delete, accessToken, remove);

router.post(path.question.like, accessToken, addLike);
router.delete(path.question.deletelike, accessToken, removeLike);

router.post(path.question.dislike, accessToken, addDislike);
router.delete(path.question.deletedislike, accessToken, removeDislike);

router.post(path.question.bookmark, accessToken, addBookmark);
router.delete(path.question.bookmark, accessToken, delBookmark);




//loc cau hoi theo tag
router.get("/tag/:tagid", searchTag);

export default router;