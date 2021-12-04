import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const initializeSchema = mongoose.Schema;

const UserSchema = new initializeSchema({
    fullname: { type: String },
    username: { type: String, unique: true },
    email: { type: String },
    password: { type: String, default: '' },
    avatar: {
        _id: { type: String, default: "" },
        avatarUrl: { type: String, default: "" }
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags'
    }],
    descriptions: {
        type: String,
        default : ""
    },
    hobbies: [{ type: String,enum : ["1","2","3","4","5","6","7","8","9","10"] }],
    birthday: { type: String,default : "" },
    points: { type: Number, default: 0 },
    userType: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    address: { type: String, default: '' },
    phoneNumber: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'collaborators'], default: 'user' },
    status: { type: String, enum: ['active', 'block', 'verify'], default: 'verify' },
    driveId: { type: String, default: '' },
    socialType: { type: String, enum: ['system', 'facebook', 'google', 'github'], default: 'system' }
},
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const passwordHashsed = await bcrypt.hash(this.password, salt);
    this.password = passwordHashsed;
});

UserSchema.methods = {
    verifyPassword: function (password) {
        return bcrypt.compareSync(password, this.password)
    }
}

UserSchema.virtual('postCounts', {
    localField: '_id',
    foreignField: 'createBy',
    ref: 'posts',
    count: true
});
UserSchema.virtual('questionCounts', {
    localField: '_id',
    foreignField: 'createBy',
    ref: 'questions',
    count: true
});
UserSchema.virtual('followers', {
    localField: '_id',
    foreignField: 'followingUserId',
    ref: 'Follows'
});


export default mongoose.model('Users', UserSchema)