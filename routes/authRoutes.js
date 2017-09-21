const express = require('express');
const cors = require('cors');
const router = express.Router();
const passport = require('passport');

router.use(cors());
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

//google(authenticate/authorize)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:8080/polls',
    failureRedirect: 'http://localhost:8080/polls',
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
  var user = req.user;
  if (user && user.google.id) {
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(err => {
      res.redirect('http://localhost:8080/polls');
    });
  }
  res.redirect('http://localhost:8080/polls');
});

//Google
router.get('/unlink/google', (req, res) => {
  var user = req.user;
  if (user && user.local.username) {
    user.google.id = undefined;
    user.google.name = undefined;
    user.save(err => {
      res.redirect('http://localhost:8080/polls');
    });
  }
  res.redirect('http://localhost:8080/polls');
});

// =============================================================================
// API =============
// =============================================================================
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:8080/polls');
});

router.get('/current_user', (req, res) => {
  res.send({ user: req.user });
});

module.exports = router;
