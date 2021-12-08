import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
const router = express.Router();
import { path } from 'constants/routeDefination';
import { getsQuestion } from 'controllers/statistic.controller';

router.post(path.statistic.question, accessToken, getsQuestion);
// router.get('/', accessToken, gets);
// router.get('/:contactId', accessToken, get);
// router.delete('/:contactId', accessToken, remove);
// router.post('/:contactId', accessToken, updateFeedback);

export default router;