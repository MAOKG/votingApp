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
  '/auth/login',
  passport.authenticate('local-login', {
    successRedirect: '/api/current_user',
    failureRedirect: '/fail',
    failureFlash: true
  })
);

// Signup or link local account
router.post(
  '/auth/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/api/current_user',
    failureRedirect: '/fail',
    failureFlash: true
  })
);

//google(authenticate/authorize)
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/api/current_user',
    failureRedirect: '/fail',
    successFlash: true
  })
);

// Fail
router.get('/fail', (req, res) => {
  res.send(req.flash('message'));
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
      res.redirect('http://localhost:8080');
    });
  }
  res.redirect('http://localhost:8080');
});

//Google
router.get('unlink/google', (req, res) => {
  var user = req.user;
  if (user && user.local.username) {
    user.google.id = undefined;
    user.google.name = undefined;
    user.save(err => {
      res.redirect('http://localhost:8080');
    });
  }
  res.redirect('http://localhost:8080');
});

// =============================================================================
// API =============
// =============================================================================
router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:8080');
});

router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

router.get('/api/message', (req, res) => {
  res.send(req.flash('message'));
});

module.exports = router;
