import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/post.controller';
import { path } from "constants/routeDefination";
import { postValidator } from 'middlewares/validate.middleware';
// import { postById, postValidator } from '../middlewares/post.middleware';



const router = express.Router();

router.get(path.post.get, read);
router.get(path.post.gets, fetchAll)
router.post(path.post.post, postValidator, create)
router.put(path.post.put, postValidator, update)
router.delete(path.post.delete, remove)

// router.param('postId', postById)

// router.param('commentId',)

export default router;