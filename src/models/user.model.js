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
        type: String,
        default: ""
    }],
    descriptions: {
        type: String,
        default: ""
    },
    hobbies: [{ type: String, default: "" }],
    birthday: { type: String, default: "" },
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
    count: true,
    match: { isDraft: false, isAccept: true }
});
UserSchema.virtual('questionCounts', {
    localField: '_id',
    foreignField: 'createBy',
    ref: 'questions',
    count: true,
    match: { spam: false }
});
UserSchema.virtual('followers', {
    localField: '_id',
    foreignField: 'followingUserId',
    ref: 'Follows'
});
UserSchema.virtual('followerCounts', {
    localField: '_id',
    foreignField: 'followingUserId',
    ref: 'Follows',
    count: true
});


export default mongoose.model('Users', UserSchema)