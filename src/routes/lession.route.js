import express from 'express';
import { create, fetchAll, lessionById, read, remove, update } from '../controllers/lession.controller';
import { lessionValidator } from './../middlewares/lession.middleware';
// init router
const router = express.Router();

router.post('/',
    lessionValidator,
    create
);
router.get('/:lessionId', read);
router.get('/', fetchAll);
router.put('/:lessionId', lessionValidator, update);
router.delete('/:lessionId', remove);

router.param('lessionId', lessionById);

export default router;
