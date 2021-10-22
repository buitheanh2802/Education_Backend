import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const TagModel = new mongoose.Schema({
    name: { type: String },
    slug: { type: String, unique: true },
    avatar: {
        _id: { type: String, default: '' },
        avatarUrl: { type: String, default: '' }
    },
    driveId: { type: String,default : '' }
},
    {
        timestamps: true
    }
);

TagModel.plugin(findOrCreate);




export default mongoose.model('tags', TagModel)