import express from 'express';
import { path } from 'constants/routeDefination';
import { gets, create,update,get,post,managerFilter,
    question,popular,follower,remove } from 'controllers/tag.controller';
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
// delete tag
router.delete(
    path.tag.delete,
    accessToken,
    accessRole(['admin']),
    remove
)
// filter tag
router.get(
    path.tag.managerFilter,
    managerFilter
)

export default router;