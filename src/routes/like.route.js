import { addLike, removeLike } from 'controllers/question.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

router.post("/:questionId", accessToken, addLike);
router.delete("/:questionId", accessToken, removeLike);

export default router;