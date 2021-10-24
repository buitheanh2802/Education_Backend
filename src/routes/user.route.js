import express from 'express';
import { path } from 'constants/routeDefination';
import { followers,following,get,myPostBookmark,myPost,myTag,myQuestion } from 'controllers/user.controller';
import { accessRole, accessToken } from 'middlewares/auth.middleware';
const router = express.Router();

// get user
router.get(
    path.user.get,
    get
);
// followers
router.get(
    path.user.followers,
    followers
)
// post bookmark
router.get(
    path.user.postBookmark,
    myPostBookmark
)
// following
router.get(
    path.user.following,
    following
)

export default router;

