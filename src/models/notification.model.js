import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: { type: String },
    isRead: { type: Boolean, default: false },
    url: { type: String },
    sender: {
        fullname: { type: String },
        avatarUrl: { type: String }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: { type: String, enum: ['user,system'], default: 'user' }
},
    { timestamps: true, _id: false }
);


module.exports = mongoose.model('Notifications', NotificationSchema);