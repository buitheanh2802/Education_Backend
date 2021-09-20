import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    followingUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true })

module.exports = mongoose.model('Follows', FollowSchema);