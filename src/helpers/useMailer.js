import nodemailer from 'nodemailer';

// gmail for team
// gmail : devchallenge113@gmail.com
// password : devchallenge@2021

// config mail server
const createTransport = nodemailer.createTransport({
    port : 587, //port default for protocol SMTP
    host : 'smtp.gmail.com',
    secure : true,
    auth : {
        user : 'devchallenge113@gmail.com',
        pass : 'yiyyezzhbeteyano'
    }
});

export const sendMail = async() => await createTransport.sendMail();