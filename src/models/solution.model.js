import mongoose from 'mongoose';

const Solution = new mongoose.Schema({
    title: { type: String },
    descriptions: { type: String },
    demoUrl: { type: String },
    repoUrl: { type: String },
    createBy : { type : mongoose.Schema.Types.ObjectId, ref : 'Users',required : true},
    votes : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Users',default : []}],
    challengeId : { type : mongoose.Schema.Types.ObjectId, ref : 'Challenges',required : true}
}, { timestamps: true });

export default mongoose.model('Solutions', Solution);