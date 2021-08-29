import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as facebookStrategy } from 'passport-facebook';

export const passportConfig = (app) => {
    app.use(passport.initialize());
    passport.serializeUser((err,done) => {

    })
    passport.deserializeUser((err,done) => {

    });
    passport.use(new localStrategy({
        passwordField : 'email',
        usernameField : 'password',
        session : false
    },(email,password,done) => {
            console.log(email);
            console.log(password);
    }))
}