import express from 'express';
import dotenv from 'dotenv';
import { initializeDB } from '@/config';
import { routes } from './routes';
import cookie from 'cookie-parser';

const serverConfig = async () => {
    // environment
    dotenv.config();
    // PORT
    const PORT = process.env.PORT || 4000;
    // initial app
    const app = express();
    // initial parse data from client
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(cookie());
    // passport config
    // connect to mongoDB
    await initializeDB();
    // routes
    routes(app);
    // listenning
    app.listen(PORT, () => console.log(`server is running at port : ${PORT}`))
}
// run
serverConfig();