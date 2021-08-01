import mongoose from 'mongoose';

//subdocs
const Rate = new mongoose.Schema({
    _idUser : { type : String },
    star : { type : Number }
})

// root schema
const CourseSchema = new mongoose.Schema({
    title : { type : String },
    content : { type : String},
    avatar : {
        id : String,
        linkUrl : String
    },
    price : { type : Number},
    rate : [Rate],
    allUser : [String],
    userID : { type : String}
});

export default mongoose.model('Courses',CourseSchema);