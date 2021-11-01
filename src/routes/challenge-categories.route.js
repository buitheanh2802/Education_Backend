import { path } from 'constants/routeDefination';
import { create, get, gets, remove, update, uploadImage } from 'controllers/challengeCategories.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { challengeCategoriesValidator } from 'middlewares/validate.middleware';
const router = express.Router();

router.get(path.challengeCategories.gets, gets);
router.get(path.challengeCategories.get, get);
router.post(path.challengeCategories.post, challengeCategoriesValidator, accessToken, create);
router.put(path.challengeCategories.put, challengeCategoriesValidator, accessToken, update);
router.delete(path.challengeCategories.delete, accessToken, remove);
router.post(path.challengeCategories.uploadImage, accessToken, uploadImage);


export default router;