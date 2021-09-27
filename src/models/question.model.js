import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    views: { type: Number },
    slug: { type: String },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    comfirmAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Questions', QuestionSchema);