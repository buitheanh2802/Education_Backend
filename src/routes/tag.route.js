import express from 'express';
import { path } from 'constants/routeDefination';
import { gets, create,update } from 'controllers/tag.controller';
import { accessRole, accessToken } from 'middlewares/auth.middleware';

const router = express.Router();

router.get(
    path.tag.gets,
    gets
);
router.post(
    path.tag.post,
    accessToken,
    accessRole(['admin', 'collaborators']),
    create
);

router.put(
    path.tag.put,
    accessToken,
    accessRole(['admin', 'collaborators']),
    update
);



export default router;