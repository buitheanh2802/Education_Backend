import express from 'express';
import { fetchAll,create } from './../controllers/course.controller';
import { upload } from './../middlewares/upload.middleware';
const router = express.Router();

// GET PUT PATCH DELETE
//       /course/
router.get('/',fetchAll);
router.post('/',
    upload.multiple('avatar'),
    create
);
router.put('/');


export default router;