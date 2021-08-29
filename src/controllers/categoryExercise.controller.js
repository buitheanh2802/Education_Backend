import CategoryExerciseModel from './../models/categoryExercise.model';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { createFile, createFolder } from '../services/drive';


export const fetchAll = (req, res) => {
    CategoryExerciseModel.find({}, (err, docs) => {
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

export const create = async (req, res) => {

    const { avatar } = req.file;
    const folder = await createFolder(uuid(), '1fxE1ZTwKgRJoGR7iSzdaYfnXodcFlryb');
    const file = await createFile(avatar.name, folder.id);

    const categoryExercise = new CategoryExerciseModel({ ...req.body, avatar: { _id: file.id, linkUrl: file.webContentLink } });
    categoryExercise.save((err, docs) => {
        if (err) {
            res.status(500).json({
                message: [
                    'ERROR_SERVER',
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
    const categoryExercise = req.categoryExercise;
    categoryExercise.remove((err, docs) => {
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
    let categoryExercise = req.categoryExercise;
    categoryExercise = _.assignIn(categoryExercise, req.body);
    categoryExercise.save((err, docs) => {
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
    return res.json(req.categoryExercise);
}
