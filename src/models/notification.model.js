import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: { type: String },
    isRead: { type: Boolean, default: false },
    url: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    sendTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    type: { type: String, enum: ['comment','vote','follow','system'] }
},
    { timestamps: true }
);

export default mongoose.model('Notifications', NotificationSchema);