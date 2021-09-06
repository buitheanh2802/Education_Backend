import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/comment.controller';
import { commentValidator } from '../middlewares/validate.middleware';

const router = express.Router();

router.get('/:commentId', read)
router.get('/', fetchAll)
router.post('/', commentValidator, create)
router.put('/:commentId', commentValidator, update)
router.delete('/:commentId', remove)

// router.param('commentId', commentById)

// router.param('commentId',)

export default router;