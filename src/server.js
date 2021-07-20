import express from 'express';
import dotenv from 'dotenv';

//initial dotenv
dotenv.config();
// initial app
const app = express();

// PORT : 
const PORT = process.env.PORT || 4000;

//https://account.mongodb.com/account/login?signedOut=true

app.listen(PORT,() => {
    console.log(`server is running in port : ${PORT}`);
})