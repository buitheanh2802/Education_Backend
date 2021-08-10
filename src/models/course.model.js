import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//subdocs
const Rate = new Schema({
    userId : { type : Schema.Types.ObjectId,ref : 'users' },
    star : { type : Number }
})

// root schema
const CourseSchema = new Schema({
    title : { type : String },
    content : { type : String},
    avatar : {
        _id : String,
        linkUrl : String
    },
    price : { type : Number},
    rate : [Rate],
    userId : { type : Schema.Types.ObjectId,ref : 'users' } 
},
{
    timestamps : true
});

export default mongoose.model('Courses',CourseSchema);