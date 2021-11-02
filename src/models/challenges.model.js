import mongoose from 'mongoose';

const ChallengesSchema = new mongoose.Schema({
    title: { type: String },
    descriptions: { type: String },
    level: { type: Number },
    challengeCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChallengeCategories' },
    submitedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    solutionSubmitedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    figmaUrl: { type: String },
    resourceUrl: { type: String },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    avatar: { type: String }
}, { timestamps: true });

export default mongoose.model('Challenges', ChallengesSchema);