import mongoose from "mongoose";
import UserModel from "./user.model";

const NotificationSchema = new mongoose.Schema({
    title: { type: String },
    isRead: { type: Boolean, default: false },
    url: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    sendTo: { type: String },
    type: { type: String, enum: ['user','system'], default: 'user' }
},
    { timestamps: true }
);

NotificationSchema.pre('save',async function(next){
    console.log(this.sendTo);
    const docs = await UserModel.findOne({ username : this.sendTo });
    this.sendTo = docs._id;
    next()
})

export default mongoose.model('Notifications', NotificationSchema);