import mongoose from 'mongoose';


const CommentSchema = new mongoose.Schema({
    content: { type: String },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    postOrQuestionId: { type: String },
    spam: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('comments', CommentSchema);