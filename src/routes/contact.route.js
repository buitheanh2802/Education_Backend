import { create, get, gets, remove, updateFeedback } from 'controllers/contact.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { contactValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.post('/', contactValidator, create);
router.get('/', accessToken, gets);
router.get('/:contactId', accessToken, get);
router.delete('/:contactId', accessToken, remove);
router.post('/:contactId', accessToken, updateFeedback);

export default router;