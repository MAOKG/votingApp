const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const User = require('./models/user');
const passportService = require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 5000;
const app = express();

mongoose.connect(keys.mongoURI);

app.use(
  cookieSession({
    maxAge: 10 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

app.listen(PORT, () => {
  console.log('Server is running!');
});
