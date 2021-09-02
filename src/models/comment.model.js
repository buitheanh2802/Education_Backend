import mongoose, { Schema } from 'mongoose';

const Reply = new Schema({
    content: { type: String, require: true, trim: true },
    avatarUrl: { type: String, require: true, trim: true },
    username: { type: String, require: true, trim: true },
})

const CommentSchema = new mongoose.Schema({
    content: { type: String, require: true, trim: true },
    isExact: { type: Boolean, require: true },
    // votes: { type: Array, require: true },
    // reply: [Reply],
    avatarUrl: { type: String, require: true, trim: true },
    userID: { type: String, require: true, },
    username: { type: String, require: true, trim: true },
    postID: { type: String, require: true }
}, { timestamps: true })

module.exports = mongoose.model('Comments', CommentSchema);