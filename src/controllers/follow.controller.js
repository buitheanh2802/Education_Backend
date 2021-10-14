import { response } from 'constants/responseHandler';
import _ from 'lodash';
import FollowModel from '../models/follow.model';

export const create = (req, res) => {
    const followDefination = {
        followingUserId: req.params.followId,
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
        followingUserId : req.params.followId,
        userId: req.userId
    }
    FollowModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if(docs.n === 0 ) return response(res,401,['ACCESS_DENIED'])
        return response(res, 200, []);
    })
}
