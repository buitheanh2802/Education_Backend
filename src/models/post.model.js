import mongoose from 'mongoose';
import shortid from 'shortid';

const PostSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    views: { type: Number, default: 0 },
    slug: { type: String },
    isPublished: { type: Boolean, default: true },
    isAccept: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    shortId: { type: String, default: shortid.generate() },
    bookmarks : [{ type : mongoose.Schema.Types.ObjectId, ref : 'users'}]
}, { timestamps: true })

module.exports = mongoose.model('posts', PostSchema);