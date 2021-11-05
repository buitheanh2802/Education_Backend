import { path } from 'constants/routeDefination';
import {  } from 'controllers/solution.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';


const router = express.Router();

// gets
router.get(
    path.solution.gets
);
// get
router.get(
    path.solution.get
)
// create
router.post(
    path.solution.post
)
// update
router.put(
    path.solution.put
)

export default router;