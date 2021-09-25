import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as facebookStrategy } from 'passport-facebook';
import { Strategy as googleStrategy } from 'passport-google-oauth20';
import { Strategy as githubStrategy } from 'passport-github2';

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
        profileFields: ['id', 'displayName', 'photos', 'emails'],
        authType : 'reauthenticate'
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile)
    }));
    passport.use(new googleStrategy({
        clientID: '545853333657-mthvtkap90ob8spr6rp7u5d20c7je8a3.apps.googleusercontent.com',
        clientSecret: 'yVFai1PU-RRah2JKAwSZowN9',
        callbackURL: `${process.env.DOMAIN}/api/auth/google/callback`,
        scope: ['email','profile']
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile)
    }));
    passport.use(new githubStrategy({
        clientID: 'd115c44a12803bc6bfe1',
        clientSecret: '9286c1effe7a6730721d19ff7734e107041ab88e',
        callbackURL: `${process.env.DOMAIN}/api/auth/github/callback`,
        scope : ['user:email']
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile)
    }));
}