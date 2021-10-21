import express from 'express';
import { path } from 'constants/routeDefination';
import { followers,following,get,myBookmark,myPost,myTag,myQuestion } from 'controllers/user.controller';
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

export default router;

