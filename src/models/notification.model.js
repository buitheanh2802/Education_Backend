import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: { type: String, require: true, trim: true },
    content: { type: String, require: true, trim: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', require: true, trim: true },
    path : { type : String },
    avatar : { type : String },
    status : { type : Boolean },
},
    { timestamps: true }
);


module.exports = mongoose.model('Notifications', NotificationSchema);