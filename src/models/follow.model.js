import mongoose from 'mongoose';
import userModel from './user.model';

const FollowSchema = new mongoose.Schema({
    followingUserId: { type: mongoose.Schema.Types.Mixed, ref: 'Users' },
    userId: { type: mongoose.Schema.Types.Mixed, ref: 'users' }
}, { timestamps: true });

FollowSchema.pre('save',async function(next){
    const docs = await userModel.findOne({ username : this.followingUserId });
    if(docs) this.followingUserId = new mongoose.Types.ObjectId(docs._id);
    else this.followingUserId = new mongoose.Types.ObjectId(this.followingUserId);
    next();
});

FollowSchema.pre('deleteOne',async function(next){
    const docs = await userModel.findOne({ username : this._conditions.followingUserId });
    if(docs) this._conditions.followingUserId = new mongoose.Types.ObjectId(docs._id);
    else this._conditions.followingUserId = new mongoose.Types.ObjectId(this._conditions.followingUserId);
    console.log(this._conditions);
    next();
});


module.exports = mongoose.model('Follows', FollowSchema);