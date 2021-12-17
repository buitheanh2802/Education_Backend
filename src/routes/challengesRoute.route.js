import { path } from 'constants/routeDefination';
import { addSubmitedUser, create, get, gets, remove, solutionSubmitedBy, update, uploadFile, uploadImage } from 'controllers/challenges.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { challengesValidator } from 'middlewares/validate.middleware';
const router = express.Router();

router.post(path.challenges.gets, gets);
router.get(path.challenges.get, get);
router.post(path.challenges.post, challengesValidator, accessToken, create);
router.put(path.challenges.put, challengesValidator, accessToken, update);
router.delete(path.challenges.delete, accessToken, remove);
router.post(path.challenges.uploadFileZip, accessToken, uploadFile);
router.post(path.challenges.addSubmitedUser, accessToken, addSubmitedUser);
router.post(path.challenges.solutionSubmitedBy, accessToken, solutionSubmitedBy);


export default router;