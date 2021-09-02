import CourseModel from './../models/course.model';
import { createFile, createFolder } from '../services/drive';
import { removeFileSystem } from '../services/system';
import {v4 as uuid } from 'uuid';

export const fetchAll = (req, res) => {
    CourseModel.find({}, (err, docs) => {
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
    const folder = await createFolder(uuid(),'1CanwfJrYr9_3pfEhAbDlCP6LitwwHEKU');
    const file = await createFile(avatar.name,folder.id);
    const course = new CourseModel({...req.body,avatar : { _id : file.id, linkUrl : file.webContentLink}});
    course.save((err,docs) => {
        if(err){
            return res.status(500).json({
                message : [
                    'ERROR_SERVER',
                    err.message
                ],
                status : false
            })
        }
        return res.status(200).json({
            message : [],
            status : true,
            data : docs
        })
    })
}