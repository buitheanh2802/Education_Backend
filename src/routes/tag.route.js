import express from 'express';
import { path } from 'constants/routeDefination';
import { gets, create,update,get,post,question,popular,follower } from 'controllers/tag.controller';
import { accessRole, accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

// tag phổ biến 
router.get(
    path.tag.popular,
    popular
)
// get one
router.get(
    path.tag.get,
    get
);
// bài viết của tag
router.get(
    path.tag.post,
    post
);
// câu hỏi của tag
router.get(
    path.tag.question,
    question
)
// những người đang theo dõi tag này
router.get(
    path.tag.follower,
    follower
);

// fetch all
router.get(
    path.tag.gets,
    gets
);
// create
router.post(
    path.tag.create,
    accessToken,
    accessRole(['admin', 'collaborators']),
    create
);
// update
router.put(
    path.tag.put,
    accessToken,
    accessRole(['admin', 'collaborators']),
    update
);


export default router;