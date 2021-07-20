import express from 'express';
import dotenv from 'dotenv';
import { mongoConnect } from './config';
//initial dotenv
dotenv.config();
// initial app
const app = express();
// connect to mongoDB
mongoConnect()
    .then(() => console.log('database is connected !'))
    .catch(err => console.log(err))


// PORT : 
const PORT = process.env.PORT || 4000;

//https://account.mongodb.com/account/login?signedOut=true

app.listen(PORT,() => {
    console.log(`server is running in port : ${PORT}`);
})