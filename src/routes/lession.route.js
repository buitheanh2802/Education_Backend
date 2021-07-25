import express from 'express';
import { create, fetchAll } from '../controllers/lession.controller';

const router = express.Router();

router.post('/', create);
router.get('/', fetchAll);
router.put('/');
router.delete('/');

export default router;
