import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as facebookStrategy } from 'passport-facebook';

export const passportConfig = (app) => {
    app.use(passport.initialize());
    passport.serializeUser((profile, done) => {
        done(null, profile)
    })
    passport.deserializeUser((profile, done) => {
        done(null, profile)
    });
    passport.use(new localStrategy({
        passwordField: 'password',
        usernameField: 'email',
        session: false
    }, (email, password, done) => {
        done(null, { email, password })
    }))
}