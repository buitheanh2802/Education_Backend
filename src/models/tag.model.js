import mongoose from 'mongoose';

const TagModel = new mongoose.Schema({
    name: { type: String },
    pathName: { type: String, unique: true },
    avatar: {
        _id: { type: String, default: '' },
        avatarUrl: { type: String, default: '' }
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model('tags', TagModel)