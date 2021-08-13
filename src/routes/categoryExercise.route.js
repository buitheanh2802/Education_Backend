import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/categoryExercise.controller';
import { upload } from '../middlewares/upload.middleware';
import { categoryExerciseById, categoryExerciseValidator } from './../middlewares/categoryExercise.middleware';

const router = express.Router();

router.get('/:categoryExercise', read);
router.get('/', fetchAll);
router.post('/', upload.single('avatar'), categoryExerciseValidator, create);
router.put('/:categoryExercise', categoryExerciseValidator, update);
router.delete('/:categoryExercise', remove);

router.param('categoryExercise', categoryExerciseById);

export default router;