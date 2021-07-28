import express from 'express';
import { fetchAll,create } from './../controllers/course.controller';
const router = express.Router();

// GET PUT PATCH DELETE
//       /course/
router.get('/',fetchAll);
router.post('/',create);
router.put('/');


export default router;