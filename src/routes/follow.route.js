import { create, fetchAll, read, remove } from 'controllers/follow.controller';
import express from 'express';
// import { followValidator } from 'middlewares/validate.middleware';


const router = express.Router();

router.get('/:followId', read);
router.get('/', fetchAll)
// router.post('/', followValidator, create)
// router.put('/:postId', postValidator, update)
router.delete('/:followId', remove)

// router.param('followId', followById)

export default router;