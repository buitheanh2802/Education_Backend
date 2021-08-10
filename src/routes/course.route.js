import express from 'express';
import { fetchAll,create } from './../controllers/course.controller';
import { upload } from './../middlewares/upload.middleware';
const router = express.Router();

// GET POST PUT DELETE
router.get('/',fetchAll);
router.post('/',
    upload.single('avatar'),
    create
);


export default router;