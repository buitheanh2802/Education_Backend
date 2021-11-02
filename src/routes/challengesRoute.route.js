import { path } from 'constants/routeDefination';
import { create, get, gets, remove, update, uploadFile, uploadImage } from 'controllers/challenges.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { challengesValidator } from 'middlewares/validate.middleware';
const router = express.Router();

router.get(path.challenges.gets, gets);
router.get(path.challenges.get, get);
router.post(path.challenges.post, challengesValidator, accessToken, create);
router.put(path.challenges.put, challengesValidator, accessToken, update);
router.delete(path.challenges.delete, accessToken, remove);
router.post(path.challenges.uploadFileZip, accessToken, uploadFile);
router.post(path.challenges.uploadImage, accessToken, uploadImage);


export default router;