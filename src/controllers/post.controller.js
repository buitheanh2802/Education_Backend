import _, { find, assignIn } from 'lodash';
import PostModel from '../models/post.model';
import { response } from 'constants/responseHandler';


// 
export const fetchAll = (req, res) => {
    PostModel.find({}, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, ['ERROR_SERVER'], docs);
    })
}

export const create = (req, res) => {
    const post = new PostModel(req.body);
    post.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}

export const update = (req, res) => {

    const conditions = {
        _id: req.params.postId,
        // sendTo: req.userId
    }
    PostModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        const newData = assignIn(docs, { isRead: true });
        newData.save((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], {});
        })
    })

    // let post = req.post;
    // post = _.assignIn(post, req.body);
    // post.save((err, docs) => {
    //     if (err) {
    //         return res.status(400).json({
    //             message: [
    //                 err.message
    //             ],
    //             status: false
    //         })
    //     }
    //     return res.status(200).json({
    //         data: docs,
    //         status: true
    //     })
    // })
}
export const read = (req, res) => {
    const conditions = {
        _id: req.params.postId,
        // sendTo: req.userId
    }
    PostModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        return response(res, 200, ['SUCCESS'], docs);
    });


    // return res.json(req.post)
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.postId,
        // sendTo: req.userId
    }
    PostModel.findOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA', err.message]);
        docs.remove((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], {});
        })
    });
}
