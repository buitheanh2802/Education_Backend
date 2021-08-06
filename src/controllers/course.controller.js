import CourseModel from './../models/course.model';
import { createFile,createFolder } from './../helpers/useDrive';

export const fetchAll = (req,res) => {
    CourseModel.find({ },(err,docs) => {
        if(err) {
            res.status(500).json({
              //tất cả những message error a ném hết vào cái properties message nhé   
               message : [
                   err.message
               ],
               //trả về true nếu lấy dữ liệu thành công và false nếu k thành công và xảy ra lỗi   
               status : false
            })
        }
        res.status(200).json({
            message : [],
            // trả về data nếu có
            data : docs,
            // status : true có tương đương với lẫy dữ liệu thành công
            status : true
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