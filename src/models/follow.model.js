import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    followingUserId: { type: String, require: true, trim: true },
    userId: { type: String, require: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Follows', FollowSchema);