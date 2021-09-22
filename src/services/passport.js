import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as facebookStrategy } from 'passport-facebook';
import { Strategy as googleStrategy } from 'passport-google-oauth20';
import { Strategy as githubStrategy } from 'passport-github';

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
    }));
    passport.use(new facebookStrategy({
        callbackURL: `${process.env.DOMAIN}/api/auth/facebook/callback`,
        clientID: '575250563926238',
        clientSecret: 'fbadd2747e6fc8209b234b187f6dbe9f',
        profileFields: ['id', 'displayName', 'photos', 'emails']
    }, (accessToken, refreshToken, profile, done) => {
        done(null,profile)
    }))
}