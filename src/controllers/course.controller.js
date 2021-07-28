import CourseModel from './../models/course.model';
import { createFile,createFolder } from './../helpers/useDrive';

// frontend => file => backend => drive
// => backend res.status(200).json()

export const fetchAll = (req,res) => {
    CourseModel.find({ },(err,docs) => {
        if(err) {
            res.status(500).json({
                message : err.message
            })
        }
        res.status(200).json({
            docs
        })
    })
}



export const create = async(req,res) => {
    //user request files
    //req.files
    //req.file
    // const folder = await createFolder('anh hải','1IPE9cxptb8cvj6ABeQJxl7GzsTjIBwnd');
    const files = await createFile('tải xuống.jfif','1oRx-oR9CCj2fvzHfgSMho3P46Y2sJ9vv');
    const course = new CourseModel({...req.body,avatar : files.webContentLink});
    course.save((err,docs) => {
        if(err){
            return res.status(400).json({
                error : err.message
            })
        }
        res.status(200).json({
            message : 'Tạo khóa học thành công',
            data : docs
        })
    })
}