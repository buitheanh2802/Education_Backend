import mongoose from 'mongoose';

const ChallengeCategoriesSchema = new mongoose.Schema({
    title: { type: String },
    descriptions: { type: String },
    avatar: { type: String }
}, { timestamps: true });

export default mongoose.model('ChallengeCategories', ChallengeCategoriesSchema);