import { response } from 'constants/responseHandler';
import _, { find } from 'lodash';
import FollowModel from '../models/follow.model';

// 
export const fetchAll = (req, res) => {
    FollowModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            data: docs,
            status: true
        })
    })
}

export const create = (req, res) => {

    const followDefination = {
        followingUserId: req.body.followingUserId,
        userId: req.userId
    }
    console.log(followDefination);
    const follow = new FollowModel(followDefination);
    follow.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}

// export const update = (req, res) => {
//     let post = req.post;
//     post = _.assignIn(post, req.body);
//     post.save((err, docs) => {
//         if (err) {
//             return res.status(400).json({
//                 message: [
//                     err.message
//                 ],
//                 status: false
//             })
//         }
//         return res.status(200).json({
//             data: docs,
//             status: true
//         })
//     })
// }

export const read = (req, res) => {
    return res.json(req.follow)
}
export const remove = (req, res) => {
    console.log(req.userId)
    const conditions = {
        _id: req.params.followId,
        userId: req.userId
    }
    FollowModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA',]);
        docs.remove((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], {});
        })
    })

    // const follow = req.follow;
    // follow.remove((err, docs) => {
    //     if (err) {
    //         return res.status(400).json({
    //             message: [
    //                 err.message
    //             ],
    //             status: false
    //         })
    //     }
    //     res.status(200).json({
    //         data: docs,
    //         status: true
    //     })
    // })
}
