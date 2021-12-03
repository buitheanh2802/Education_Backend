import mongoose from 'mongoose';

const SpamSchema = new mongoose.Schema({
    reason: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },
    content: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    referenceTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type',
        required: true
    },
    type: {
        type: String,
        enum: ["comments", "questions"],
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('spams', SpamSchema)