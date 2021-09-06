import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: { type: String },
    isRead: { type: Boolean, default: false },
    url: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    sendTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: { type: String, enum: ['user','system'], default: 'user' }
},
    { timestamps: true }
);


export default mongoose.model('Notifications', NotificationSchema);