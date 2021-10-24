import { path } from 'constants/routeDefination';
import { create, get, gets, rate, remove, update } from 'controllers/exercise-layout.controller';
import express from 'express';
import { accessToken } from 'middlewares/auth.middleware';
import { exerciseLayoutValidator } from 'middlewares/validate.middleware';
const router = express.Router();

router.get(path.exerciseLayout.gets, gets);
router.get(path.exerciseLayout.get, get);
router.post(path.exerciseLayout.post, exerciseLayoutValidator, accessToken, create);
router.put(path.exerciseLayout.put, exerciseLayoutValidator, accessToken, update);
router.delete(path.exerciseLayout.delete, accessToken, remove);
router.post(path.exerciseLayout.rate, accessToken, rate)


export default router;