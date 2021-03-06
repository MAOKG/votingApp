/* eslint-disable  consistent-return, no-else-return */

const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// Local-login
passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    (req, email, password, done) => {
      const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      // Server side form validation
      if (!emailRegExp.test(email)) {
        return done(null, false, req.flash('message', 'Please enter a valid email'));
      } else if (!passwordRegExp.test(password)) {
        return done(null, false, req.flash('message', 'Please enter a valid password'));
      } else {
        User.findOne({ 'local.email': email }, (err, existingUser) => {
          if (err) {
            return done(err);
          } else if (!existingUser) {
            return done(null, false, req.flash('message', 'No user found.'));
          } else if (!existingUser.validPassword(password)) {
            // access the information passed as the third parameter as req.authInfo.
            return done(null, false, req.flash('message', 'Incorrect password.'));
          } else {
            return done(null, existingUser);
          }
        });
      }
    }
  )
);

// Local-signup
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    (req, email, password, done) => {
      const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      // Server side form validation
      if (!emailRegExp.test(email)) {
        return done(null, false, req.flash('message', 'Please enter a valid email'));
      } else if (!passwordRegExp.test(password)) {
        return done(null, false, req.flash('message', 'Please enter a valid password'));
      } else if (!req.body.firstName) {
        return done(null, false, req.flash('message', 'Please enter a valid firstName'));
      } else if (!req.body.lastName) {
        return done(null, false, req.flash('message', 'Please enter a valid lastName'));
      } else {
        User.findOne({ 'local.email': email }, (err, existingUser) => {
          if (err) {
            return done(err);
          } else if (existingUser) {
            return done(null, false, req.flash('message', 'User with this email already exists'));
          } else if (req.user) {
            // if user is logged in, link to a local account
            const user = req.user;
            user.local.email = email;
            user.local.password = user.generateHash(password);
            user.local.firstName = req.body.firstName;
            user.local.lastName = req.body.lastName;
            user.save(error => {
              if (error) throw error;
              return done(null, user);
            });
          } else {
            // Register a new user
            const newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.local.firstName = req.body.firstName;
            newUser.local.lastName = req.body.lastName;
            newUser.save(error => {
              if (error) throw error;
              return done(null, newUser);
            });
          }
        });
      }
    }
  )
);

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/api/auth/google/callback',
      proxy: true,
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    (req, accessToken, refreshToken, profile, done) => {
      User.findOne({ 'google.id': profile.id }, (err, existingUser) => {
        if (err) {
          return done(err);
        }

        // User wants to login or signup
        if (!req.user) {
          // Login with google
          if (existingUser) {
            return done(null, existingUser);
          }
          // console.log(`User is  ${req.user}`);
          // Sign up a new account with google
          const newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.name = profile.displayName;
          newUser.save(error => {
            if (error) {
              throw error;
            }
            return done(null, newUser);
          });
        } else if (existingUser) {
          // User already logged in, link to google acount
          // User with the same google account already exsits, return the same user
          return done(null, req.user, req.flash('message', 'User with the same google account already exsits'));
        } else {
          // Link to google account
          const user = req.user;
          // console.log(user);
          user.google.id = profile.id;
          user.google.name = profile.displayName;
          user.save(error => {
            if (error) throw error;
            return done(null, user);
          });
        }
      });
    }
  )
);
