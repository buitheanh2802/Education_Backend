import mongoose from 'mongoose';

const ExerciseLayoutSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    price: { type: Number },
    linkFigma: { type: String },
    rate: [{
        idUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        point: { type: Number }
    }],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
}, { timestamps: true });

export default mongoose.model('Exerciselayouts', ExerciseLayoutSchema);