import mongoose from 'mongoose';

export const mongoConnect = async() => {
    return await mongoose.connect(process.env.MONGO_URL,{
        useFindAndModify : false,
        useCreateIndex : true,
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
}