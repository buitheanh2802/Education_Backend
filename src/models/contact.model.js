import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, require: true },
    phone: { type: String },
    title: { type: String },
    content: { type: String },
}, { timestamps: true });

export default mongoose.model('Contact', ContactSchema);