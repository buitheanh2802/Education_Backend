import LessionModel from "./../models/lession.model";
import _ from 'lodash'

export const fetchAll = (req, res) => {
    LessionModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: [
                    err.message
                ],
                status: false
            })
        }
        res.status(200).json({
            message: [],
            data: docs,
            status: true
        })
    })
}

export const create = (req, res) => {
    const lession = new LessionModel(req.body);
    lession.save((err, docs) => {
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

export const remove = (req, res) => {
    const lession = req.lession;
    // remove drive
    lession.remove((err, docs) => {
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
export const update = (req, res) => {
    let lession = req.lession;
    lession = _.assignIn(lession, req.body);
    lession.save((err, docs) => {
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
    return res.json(req.lession)
}