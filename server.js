/* eslint no-console:0 */
require('babel-register');
const express = require('express');
require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');
const keys = require('./config/keys');
require('./models/user');
require('./models/poll');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const PORT = process.env.PORT || 5000;
const app = express();

mongoose.connect(keys.mongoURI);

app.use(
  cookieSession({
    maxAge: 10 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

app.listen(PORT, () => {
  console.log('Server is running!');
});
