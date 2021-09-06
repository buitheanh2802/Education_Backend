import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/post.controller';
// import { postById, postValidator } from '../middlewares/post.middleware';

const router = express.Router();

// router.get('/:postId', read);
// router.get('/', fetchAll)
// router.post('/', postValidator, create)
// router.put('/:postId', postValidator, update)
// router.delete('/:postId', remove)

// router.param('postId', postById)

// router.param('commentId',)

export default router;