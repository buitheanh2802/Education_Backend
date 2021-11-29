import express from 'express';
import dotenv from 'dotenv';
import { initializeDB } from 'constants/dbConnect';
import { routes } from 'routes';
import { passportConfig } from 'services/passport';
import cookie from 'cookie-parser';
import cors from 'cors';
// import { sendMail } from 'services/mailer';


const serverConfig = async () => {
    // environment
    dotenv.config();
    // PORT
    const PORT = process.env.PORT || 4000;
    // initial app
    const app = express();
    // config header 
    app.disable('x-powered-by');
    // initial parse data from client;
    app.use(cors({
        methods : 'GET,POST,PUT,DELETE',
        credentials : true,
        origin : ['http://localhost:3000','http://172.20.10.2:3000','http://127.0.0.1:5500']
    }))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookie());
    // passport config
    passportConfig(app);
    // connect to mongoDB
    await initializeDB();
    // routes
    routes(app);
    // sendMail('theanhbui345@gmail.com','Xác thực tài khoản của bạn','verifyEmailTemplate',{ activeUrl : "https://mail.google.com/mail/u/1/#inbox"})
    // listenning
    app.listen(PORT, () => console.log(`server is running at port : ${PORT}`))
}
// running server !
serverConfig();