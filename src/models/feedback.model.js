import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: Number, require: true },
    content: { type: String, require: true },
    title: { type: String, require: true },
}, { timestamps: true })

export default mongoose.model('Feedbacks', FeedbackSchema);