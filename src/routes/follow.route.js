import { create, fetchAll, read, remove } from 'controllers/follow.controller';
import { accessToken } from 'middlewares/auth.middleware';
import express from 'express';
// import { followValidator } from 'middlewares/validate.middleware';


const router = express.Router();
// followingId: { type: String, require: true, trim: true },
// userId: { type: String, require: true, trim: true }
// req : token => userId
// 
router.post('/:followId',
    accessToken ,
    // => req.userId
    create
);
router.get('/', fetchAll)
// router.post('/', followValidator, create)
// router.put('/:postId', postValidator, update)
router.delete('/:followId', remove)

// router.param('followId', followById)

export default router;