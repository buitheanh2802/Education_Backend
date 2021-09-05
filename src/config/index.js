import mongoose from 'mongoose';

export const initializeDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useFindAndModify: false,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('database is connected !')
    } catch (error) {
        console.log(`error connect to mongoDB : ${error.message}`)
    }
}