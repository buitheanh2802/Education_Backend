import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    views: { type: Number, default: 0 },
    slug: { type: String },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    comfirmAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    spam: { type: Boolean, default: false }
}, { timestamps: true });

QuestionSchema.virtual('comments',{
    localField : '_id',
    foreignField : 'postOrQuestionId',
    count : true,
    ref: 'comments',
})

export default mongoose.model('questions', QuestionSchema);