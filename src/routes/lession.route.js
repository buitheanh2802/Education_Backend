import express from 'express';
import { create, fetchAll, lessionById, remove } from '../controllers/lession.controller';
import { lessionValidator } from './../middlewares/lession.middleware';
// init router
const router = express.Router();

router.post('/',
    lessionValidator,
    create
);
router.get('/', fetchAll);
router.put('/');
router.delete('/:lessionId', remove);

router.param('lessionId', lessionById);

export default router;
