import mongoose from 'mongoose';

const spamSchema = new mongoose.Schema({
    reason : {
        type : String
    },
    content : {
        type : String
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    referenceTo : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : 'type',
        required : true
    },
    type : {
        type : String,
        enum : ["comments","questions"],
        required : true
    }
},{
    timestamps : true
});

export default mongoose.model('spam', spamSchema)