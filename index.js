// require('babel-register');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');
const keys = require('./config/keys');
const User = require('./models/user');
const Poll = require('./models/poll');
const passportService = require('./services/passport');
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
