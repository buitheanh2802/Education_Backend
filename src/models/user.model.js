import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const initializeSchema = mongoose.Schema;

const UserSchema = new initializeSchema({
    fullname : { type : String },
    username : { type : String },
    email : { type : String },
    password : { type : String },
    avatar : {
        id : { type : String, default : ""},
        linkUrl : { type : String , default : ""}
    },
    address : { type : String,default : '' },
    phoneNumber : { type : Number ,default : ''},
    role : { type : String , enum : ['user','admin','mentor','staff'],default : 'user'},
    typeLogin : { type : String , enum : ['system','fb','gg'],default : 'system'},
    secretkey : { type : String,default : '' },
    status : { type : String,enum : ['active','block','verify'],default : 'verify' }
},
{
    timestamps : true
});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const passwordHashsed = await bcrypt.hash(this.password,salt);
    this.password = passwordHashsed;
    next();
})

UserSchema.methods = {
    verifyPassword : function(password){
        console.log(this.password);
        return bcrypt.compareSync(password,this.password)
    }
}

export default mongoose.model('Users',UserSchema)