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
        user: 'devstargroup@gmail.com',
        pass: 'mnxasvoqkgfouahj'
    },
    service: 'gmail'
});

// initial middleware of transport
// use template handlebars for send email
transportion.use('compile', handlebars({
    extName: '.hbs',
    viewPath: path.resolve(__dirname, '../../public/template'),
    viewEngine: {
        extname: '.hbs',
        defaultLayout: 'verifyEmailTemplate',
        layoutsDir: path.resolve(__dirname, '../../public/template')
    }
}))

// export function
export const sendMail = async (sendTo, subject, template,variables) => {
    const data = await transportion.sendMail({
        from: 'DevStar <devstargroup@gmail.com>',
        to: sendTo,
        replyTo: 'devstargroup@gmail.com',
        subject,
        template,
        context : variables
    });
    console.log('Email sent successfully');
}