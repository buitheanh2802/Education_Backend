import mongoose from 'mongoose';
import shortid from 'shortid';

const PostSchema = new mongoose.Schema({
    title: { type: String, require: true, trim: true },
    content: { type: String, require: true, trim: true },
    views: { type: Number, require: true, trim: true },
    slug: { type: String, require: true, trim: true },
    isPublished: { type: Boolean, require: true, trim: true },
    isAccept: { type: Boolean, require: true, trim: true },
    isDraft: { type: Boolean },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    shortId: { type: String, default: shortid.generate() }
}, { timestamps: true })

module.exports = mongoose.model('posts', PostSchema);