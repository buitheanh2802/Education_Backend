import { path } from 'constants/routeDefination';
import { addBookmark, addDislike, addLike, addView, create, delBookmark, follow, get, gets, listBookmark, remove, removeDislike, removeLike, searchTag, update, updateSpam } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { questionValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.get(path.question.follow, accessToken, follow)

router.get(path.question.listbookmark, accessToken, listBookmark);

router.put(path.question.spam, accessToken, updateSpam);

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


router.post(path.question.view, addView);





//loc cau hoi theo tag
router.get("/tag/:tagid", searchTag);

export default router;