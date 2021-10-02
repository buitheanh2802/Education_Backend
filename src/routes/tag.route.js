import express from 'express';
import { path } from 'constants/routeDefination';
import { gets, create } from 'controllers/tag.controller';
import { tagValidator } from 'middlewares/validate.middleware';
import { accessRole, accessToken } from 'middlewares/auth.middleware';
import { upload } from 'middlewares/upload.middleware';

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
)

export default router;