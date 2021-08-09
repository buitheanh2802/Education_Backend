import CourseModel from './../models/course.model';
import { createFile, createFolder } from './../helpers/useDrive';
import { createFileSystem, removeFileSystem } from './../helpers/useSystem';
import Formidable from 'formidable';

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
    console.log(req.body);
    console.log(req.files);
    // const folder = await createFolder('hihi','1IPE9cxptb8cvj6ABeQJxl7GzsTjIBwnd');
    // const file = await createFile(avatar.name,folder.id);
    // const course = new CourseModel({...fields,avatar : file.webContentLink});
    // course.save((err,docs) => {
    //     console.log(docs);
    // })

    //user request files
    //req.files
    //req.file
    // const folder = await createFolder('anh hải','1IPE9cxptb8cvj6ABeQJxl7GzsTjIBwnd');
    // const files = await createFile('tải xuống.jfif','1oRx-oR9CCj2fvzHfgSMho3P46Y2sJ9vv');
    // const course = new CourseModel({...req.body,avatar : files.webContentLink});
    // course.save((err,docs) => {
    //     if(err){
    //         return res.status(400).json({
    //             error : err.message
    //         })
    //     }
    //     res.status(200).json({
    //         message : 'Tạo khóa học thành công',
    //         data : docs
    //     })
    // })
}