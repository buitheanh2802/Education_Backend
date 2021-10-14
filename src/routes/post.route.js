import express from 'express';
import { newest,following,create,get,action,trending,update,remove,publish,publishList,unPublish,edit } from '../controllers/post.controller';
import { path } from "constants/routeDefination";
import { postValidator } from 'middlewares/validate.middleware';
import { accessToken,accessRole } from 'middlewares/auth.middleware';
const router = express.Router();

// newest
router.get(
    path.post.newest,
    newest
);
// following
router.get(
    path.post.following,
    following
)
// trending
router.get(
    path.post.trending,
    trending
);
// update
router.put(
    path.post.put,
    postValidator,
    accessToken,
    update
)
// get
router.get(
    path.post.get,
    get
);
// create
router.post(
    path.post.post, 
    postValidator,
    accessToken,
    create
);
// remove
router.delete(
    path.post.delete,
    accessToken,
    remove
)
// like and dislike
router.post(
    path.post.like,
    accessToken,
    action({ type : 'likes'})
)
// dislike
router.post(
    path.post.dislike,
    accessToken,
    action({ type : 'dislikes'})
)
// bookmark
router.post(
    path.post.bookmark,
    accessToken,
    action({ type : 'bookmarks'})
);
// publish list
router.get(
    path.post.publishList,
    accessToken,
    accessRole(['admin','collaborators']),
    publishList
);
// publish accept 
router.put(
    path.post.publishPost,
    accessToken,
    accessRole(['admin','collaborators']),
    publish
);
// unpublish
router.delete(
    path.post.unPublishPost,
    accessToken,
    accessRole(['admin','collaborators']),
    unPublish
);
// edit 
router.get(
    path.post.edit,
    edit
)

export default router;