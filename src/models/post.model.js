import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    views: { type: Number, default: 0 },
    slug: { type: String,default : '' },
    isPublished: { type: Boolean, default: true },
    isAccept: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    tags: [{ type: String }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    shortId: { type: String, default: '' },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId }],
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId }]
}, { timestamps: true });

PostSchema.virtual('comments',{
    localField : 'shortId',
    foreignField : 'postOrQuestionId',
    ref : 'Comments',
    count : true
});



module.exports = mongoose.model('posts', PostSchema);