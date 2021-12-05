import { create, get, gets, remove } from 'controllers/contact.controller';
import express from 'express';
import { accessRole, accessToken } from 'middlewares/auth.middleware';
import { contactValidator } from 'middlewares/validate.middleware';

const router = express.Router();

router.post('/', contactValidator, create);
router.get('/', accessToken, gets);
router.get('/:contactId', accessToken, get);
router.delete('/:contactId', accessToken, remove);


export default router;