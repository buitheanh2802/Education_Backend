import express from 'express';
import { path } from 'constants/routeDefination';
import { followers,following,get,myPostBookmark,myPost,points,userManagerList,
    userManagerEdit,userManagerFilter,featuredAuthorList,otherPostSameAuthor,
    myTag,myQuestion,featuredAuthor } from 'controllers/user.controller';
import { accessRole, accessToken } from 'middlewares/auth.middleware';
const router = express.Router();

// featured author list
router.get(
    path.user.featuredAuthorList,
    featuredAuthorList
);
// featured-author
router.get(
    path.user.featuredAuthor,
    featuredAuthor
)
// other post same author
router.get(
    path.user.otherPostSameAuthor,
    otherPostSameAuthor
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
// manager list
router.get(
    path.user.managerList,
    userManagerList
)
// manager edit
router.put(
    path.user.managerEdit,
    accessToken,
    accessRole(['admin']),
    userManagerEdit
);
// manager filter
router.post(
    path.user.managerFilter,
    userManagerFilter
);


export default router;

