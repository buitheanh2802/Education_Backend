import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: { type: String, require: true, trim: true },
    content: { type: String, require: true, trim: true },
    type: { type: String, require: true, trim: true },
    userID: { type: String, require: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Notifications', NotificationSchema);