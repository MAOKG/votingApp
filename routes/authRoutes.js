const express = require('express');
const cors = require('cors');
const router = express.Router();
const passport = require('passport');

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('http://localhost:8080');
});

router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:8080');
});

router.get('/api/current_user', cors(), (req, res) => {
  res.send(req.user);
});

module.exports = router;
