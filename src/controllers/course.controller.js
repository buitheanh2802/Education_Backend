import CourseModel from './../models/course.model';

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