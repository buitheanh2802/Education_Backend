import mongoose from "mongoose";

const LessionSchema = new mongoose.Schema({
    title: { type: String, require: true, trim: true },
    linkLession: { type: String, require: true, trim: true },
    courseID: { type: String, require: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Lessions', LessionSchema);