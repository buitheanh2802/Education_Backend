import express from 'express';
import { path } from 'constants/routeDefination';
import { create, gets, remove, update, action, updateSpam } from 'controllers/comment.controller';
import { commentValidator, commentUpdateValidator } from 'middlewares/validate.middleware';
import { accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

// gets route
router.get(
    path.comment.gets,
    gets
);
// create route
router.post(path.comment.post,
    commentValidator,
    accessToken,
    create
);
// edit route
router.put(
    path.comment.put,
    commentUpdateValidator,
    accessToken,
    update
);
// delete route
router.delete(
    path.comment.put,
    accessToken,
    remove
);
// like route
router.put(
    path.comment.like,
    accessToken,
    action({ type: 'likes' })
);
// dislike route
router.delete(
    path.comment.dislike,
    accessToken,
    action({ type: 'dislikes' })
);

//update spam
router.put(path.comment.spam, accessToken, updateSpam);



export default router;