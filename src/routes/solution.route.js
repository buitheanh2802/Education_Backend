import { path } from 'constants/routeDefination';
import { get,gets,remove,update,create  } from 'controllers/solution.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';


const router = express.Router();

// gets
router.get(
    path.solution.gets,
    gets
);
// get
router.get(
    path.solution.get,
    get
)
// create
router.post(
    path.solution.post,
    create
)
// update
router.put(
    path.solution.put,
    update
)
// remove
router.delete(
    path.solution.delete,
    remove
)
export default router;