import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: { type: String, require: true, trim: true },
    lessionID: { type: String, require: true, trim: true },
    userID: { type: String, require: true, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Comments', CommentSchema);