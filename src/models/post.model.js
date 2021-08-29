import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: { type: String, require: true, trim: true },
    content: { type: String, require: true, trim: true },
    views: { type: Number, require: true, trim: true },
    isPublished: { type: Boolean, require: true, trim: true },
    slug: { type: String, require: true, trim: true },
    isApprove: { type: Boolean, require: true, trim: true },
    userID: { type: String, require: true, trim: true },
    votes: { type: Array, require: true, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Posts', PostSchema);