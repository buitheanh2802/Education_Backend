import express from 'express';
import { create, fetchAll } from '../controllers/lession.controller';
import { lessionValidator } from './../middlewares/lession.middleware';
// init router
const router = express.Router();

router.post('/',
    lessionValidator,
    create
);
router.get('/', fetchAll);
router.put('/');
router.delete('/');

export default router;
