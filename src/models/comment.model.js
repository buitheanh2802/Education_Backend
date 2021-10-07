import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: { type: String },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    createBy: { type: mongoose.Schema.Types.ObjectId },
    postOrQuestionId: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Comments', CommentSchema);