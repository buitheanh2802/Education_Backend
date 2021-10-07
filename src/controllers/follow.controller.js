import { response } from 'constants/responseHandler';
import _ from 'lodash';
import FollowModel from '../models/follow.model';

export const create = (req, res) => {
    const followDefination = {
        followingUserId: req.body.followingUserId,
        userId: req.userId
    }
    const follow = new FollowModel(followDefination);
    follow.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}

export const remove = (req, res) => {
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
}
