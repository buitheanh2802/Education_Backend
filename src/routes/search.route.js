import { search } from 'controllers/search.controller';
import express from 'express';

const router = express.Router();

router.post('/', search);

export default router;