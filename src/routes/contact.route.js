import { create, get, gets, remove, updateFeedback,managerFilter } from 'controllers/contact.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { contactValidator } from 'middlewares/validate.middleware';
import { path } from "constants/routeDefination";

const router = express.Router();

router.post(path.contact.create, contactValidator, create);
router.get(path.contact.gets, accessToken, gets);
router.get(path.contact.get, accessToken, get);
router.delete(path.contact.delete, accessToken, remove);
// filter contact 
router.get(path.contact.managerFilter,accessToken,managerFilter)
router.post('/:contactId', accessToken, updateFeedback);

export default router;