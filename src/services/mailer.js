import nodemailer from 'nodemailer';
// use handlebars to write template send mail
import handlebars from 'nodemailer-express-handlebars';
import path from 'path';
// gmail for team
// gmail : devchallenge113@gmail.com
// password : devchallenge@2021

// config mail server
const transportion = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: 'devchallenge113@gmail.com',
        pass: 'icpxzdedojjclbre'
    },
    service: 'gmail'
});

// initial middleware of transport
// use template handlebars for send email
transportion.use('compile', handlebars({
    extName: '.hbs',
    viewPath: path.resolve(__dirname, '../assets/template'),
    viewEngine: {
        extname: '.hbs',
        defaultLayout: 'verifyEmailTemplate',
        layoutsDir: path.resolve(__dirname, '../assets/template')
    }
}))

// export function
export const sendMail = async (sendTo, subject, template,variables) => {
    const data = await transportion.sendMail({
        from: 'Devchallenge <devchallenge123@gmail.com>',
        to: sendTo,
        replyTo: 'devchallenge113@gmail.com',
        subject,
        template,
        context : variables
    });
    console.log('Email sent successfully');
}