/* eslint no-console:0 */
const express = require('express');
const cors = require('cors');

const router = express.Router();
const passport = require('passport');

router.use(cors());

// const proxyPrefix = '';
const proxyPrefix = 'http://localhost:8080';

// ==========================================================
// Authenticate/Authorize ===============================
// ==========================================================

// Local -----------------------------
// Login
router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/api/auth/current_user',
    failureRedirect: '/api/auth/fail',
    failureFlash: true
  })
);

// Signup or link local account
router.post(
  '/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/api/auth/current_user',
    failureRedirect: '/api/auth/fail',
    failureFlash: true
  })
);

// google(authenticate/authorize)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'back',
    failureRedirect: 'back',
    successFlash: true
  })
);

// Fail
router.get('/fail', (req, res) => {
  res.send({ message: req.flash('message')[0] });
});

// =============================================================================
// Unlink accounts =============
// =============================================================================

// local
router.get('/unlink/local', (req, res) => {
  const user = req.user;
  if (user && user.google.id) {
    user.local = undefined;
    user.save(err => {
      if (err) {
        console.log(err);
      }
      res.redirect(`${proxyPrefix}/user/profile`);
    });
  } else {
    res.redirect(`${proxyPrefix}/user/profile`);
  }
});

// Google
router.get('/unlink/google', (req, res) => {
  const user = req.user;
  if (user && user.local.email) {
    user.google = undefined;
    user.save(err => {
      if (err) {
        console.log(err);
      }
      res.redirect(`${proxyPrefix}/user/profile`);
    });
  } else {
    res.redirect(`${proxyPrefix}/user/profile`);
  }
});

// =============================================================================
// API =============
// =============================================================================
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(`${proxyPrefix}/polls`);
});

router.get('/current_user', (req, res) => {
  res.send({ user: req.user });
});

module.exports = router;
