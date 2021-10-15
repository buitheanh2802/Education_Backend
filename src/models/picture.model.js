import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const PictureSchema = new mongoose.Schema({
    photo: {
        id: { type: String },
        photoUrl: { type: String }
    },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
}, { timestamps: true });

PictureSchema.plugin(findOrCreate)

export default mongoose.model("Pictures", PictureSchema);