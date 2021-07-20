import express from 'express';
import { fetchAll } from './../controllers/course.controller';
const router = express.Router();

// GET PUT PATCH DELETE
//       /course/
router.get('/',fetchAll);
router.post('/');
router.put('/');


export default router;