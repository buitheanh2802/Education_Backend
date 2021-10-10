import mongoose from 'mongoose';
import userModel from './user.model';

const FollowSchema = new mongoose.Schema({
    followingUserId: { type: mongoose.Schema.Types.Mixed, ref: 'users' },
    userId: { type: mongoose.Schema.Types.Mixed, ref: 'users' }
}, { timestamps: true });

FollowSchema.pre('save',async function(next){
    const docs = await userModel.findOne({ username : this.followingUserId });
    if(docs) this.followingUserId = new mongoose.Types.ObjectId(docs._id);
    else this.followingUserId = new mongoose.Types.ObjectId(this.followingUserId);
    next()
});

module.exports = mongoose.model('Follows', FollowSchema);