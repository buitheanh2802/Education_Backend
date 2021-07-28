import express from 'express';
import dotenv from 'dotenv';
import { mongoConnect } from './config';
import { routes } from './routes';
//initial dotenv
dotenv.config();

// initial app
const app = express();

// initial parse data from client
app.use(express.json());
app.use(express.urlencoded({ extended : true}))

// connect to mongoDB
mongoConnect()
    .then(() => console.log('database is connected !'))
    .catch(err => console.log(err))


// PORT : 
const PORT = process.env.PORT || 4000;

// init route
routes(app);

app.listen(PORT,() => {
    console.log(`server is running in port : ${PORT}`);
})