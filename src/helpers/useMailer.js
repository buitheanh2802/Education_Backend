import nodemailer from 'nodemailer';
// use handlebars to write template send mail
import handlebars from 'nodemailer-express-handlebars';
import path from 'path';
// gmail for team
// gmail : devchallenge113@gmail.com
// password : devchallenge@2021

// config mail server
const transportion = nodemailer.createTransport({
    port : 465, //port default for protocol SMTP
    host : 'smtp.gmail.com',
    secure : true,
    auth : {
        user : 'devchallenge113@gmail.com',
        pass : 'yiyyezzhbeteyano'
    }
});

// initial middleware of transport
transportion.use('compile',handlebars({
    extName : '.hbs',
    viewPath : path.resolve(__dirname,'../assets/template'),
    viewEngine : {
        extname : '.hbs',
        defaultLayout : 'verifyEmailTemplate',
        layoutsDir : path.resolve(__dirname,'../assets/template')
    }
}))

export const sendMail = async(sendTo,subject,template) => await transportion.sendMail({
    from : `Devchallenge VerifyAccount <devchallenge123@gmail.com>`,
    to : sendTo,
    replyTo : 'devchallenge123@gmail.com',
    subject,
    template
});

async function sendTest (){
    try {
        await sendMail('theanhbui345@gmail.com','hello the anh','verifyEmailTemplate');
        console.log('mail is send');
    } catch (error) {
        console.log(error.message);
    }
}
sendTest();