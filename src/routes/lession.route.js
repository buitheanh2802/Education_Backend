import express from 'express';
import { create, fetchAll, read, remove, update } from '../controllers/lession.controller';
import { lessionById, lessionValidator } from './../middlewares/lession.middleware';
// init router
const router = express.Router();

router.post('/',
    lessionValidator,
    create
);
router.get('/:lessionId', read);
router.put('/:lessionId', lessionValidator, update);
router.delete('/:lessionId', remove);
router.get('/', fetchAll);

router.param('lessionId', lessionById);

export default router;
