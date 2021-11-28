import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    views: { type: Number, default: 0 },
    slug: { type: String, default: '' },
    isAccept: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    shortId: { type: String, default: '' },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId }],
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId }],
    publishedBy: {
        user: { type: mongoose.Schema.Types.Mixed, ref: 'Users', default: new mongoose.Types.ObjectId() },
        isConfirm: { type: Boolean, default: false }
    },
}, { timestamps: true });

PostSchema.virtual('comments', {
    localField: 'shortId',
    foreignField: 'postOrQuestionId',
    ref: 'Comments',
    count: true
});


module.exports = mongoose.model('posts', PostSchema);