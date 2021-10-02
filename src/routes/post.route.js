import express from 'express';
import { newest,following } from '../controllers/post.controller';
import { path } from "constants/routeDefination";
import { postValidator } from 'middlewares/validate.middleware';
const router = express.Router();

// newest
router.get(
    path.post.newest,
    newest
);
// following
router.get(
    path.post.following,
    following
)
// router.get(path.post.get, read);
// router.get(path.post.gets, fetchAll)
// router.post(path.post.post, postValidator, create)
// router.put(path.post.put, postValidator, update)
// router.delete(path.post.delete, remove)

export default router;