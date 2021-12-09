import express from 'express';
import { path } from 'constants/routeDefination';
import { followers,following,get,myPostBookmark,myPost,points,
    myTag,myQuestion,featuredAuthor } from 'controllers/user.controller';
import { accessRole, accessToken } from 'middlewares/auth.middleware';
const router = express.Router();

// featured-author
router.get(
    path.user.featuredAuthor,
    featuredAuthor
)
// get user
router.get(
    path.user.get,
    get
);
// my post
router.get(
    path.user.post,
    myPost
);
// my question 
router.get(
    path.user.question,
    myQuestion
)
// my tags
router.get(
    path.user.tag,
    myTag
)
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
// up and down point
router.post(
    path.user.points,
    points
)

export default router;

