import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/feedback.controller';
import { feedbackById, feedbackValidator } from '../middlewares/feedback.middleware';

const router = express.Router();

router.post('/', feedbackValidator, create);
router.put('/:feedbackId', feedbackValidator, update);
router.get('/:feedbackId', read);
router.delete('/:feedbackId', remove);
router.get('/', fetchAll);

router.param('feedbackId', feedbackById);

export default router;