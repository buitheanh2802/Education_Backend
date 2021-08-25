import mongoose from 'mongoose';

const CategoryExerciseSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    avatar: {
        _id: String,
        linkUrl: String
    }
}, { timestamps: true })

module.exports = mongoose.model('CategoryExercises', CategoryExerciseSchema);