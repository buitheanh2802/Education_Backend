import mongoose from 'mongoose';

const initializeSchema = mongoose.Schema;

const UserSchema = new initializeSchema({
    fullName : { type : String },
    username : { type : String },
    email : { type : String },
    password : { type : String },
    avatar : {
        id : String,
        linkUrl : String
    },
    address : String,
    phoneNumber : String,
    role : String,
    type : String,
    secretkey : String
},
{
    timestamps : true
});

UserSchema.methods = {
    // verifyPassword : 
}