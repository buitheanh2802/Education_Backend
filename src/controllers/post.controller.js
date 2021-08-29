import _, { find } from 'lodash';
import PostModel from '../models/post.model';

// 
export const fetchAll = (req, res) => {
    PostModel.find({}, (err, docs) => {
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
    const post = new PostModel(req.body);
    post.save((err, docs) => {
        if (err) {
            res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            data: docs,
            message: [],
            status: true
        })
    })
}

export const update = (req, res) => {
    let post = req.post;
    post = _.assignIn(post, req.body);
    post.save((err, docs) => {
        if (err) {
            return res.status(400).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        return res.status(200).json({
            data: docs,
            status: true
        })
    })
}
export const read = (req, res) => {
    return res.json(req.post)
}
export const remove = (req, res) => {
    const post = req.post;
    post.remove((err, docs) => {
        if (err) {
            return res.status(400).json({
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
