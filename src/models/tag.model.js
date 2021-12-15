import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const TagModel = new mongoose.Schema({
    name: { type: String },
    slug: { type: String, unique: true },
    avatar: {
        _id: { type: String, default: '' },
        avatarUrl: { type: String, default: '' }
    },
    driveId: { type: String, default: '' }
},
    {
        timestamps: true
    }
);

TagModel.plugin(findOrCreate);

TagModel.virtual('postCounts', {
    localField: '_id',
    foreignField: 'tags',
    ref: 'posts',
    count: true,
    match: { isDraft: false, isAccept: true }
})
TagModel.virtual('questionCounts', {
    localField: '_id',
    foreignField: 'tags',
    ref: 'questions',
    count: true,
    match: { spam: false }
});
TagModel.virtual('followerCounts', {
    localField: '_id',
    foreignField: 'followingUserId',
    ref: 'Follows',
    // count : true
});
TagModel.virtual('followers', {
    localField: '_id',
    foreignField: 'followingUserId',
    ref: 'Follows',
    count: true,
    options: {
        sort: { followers: -1 }
    }
});



export default mongoose.model('tags', TagModel)