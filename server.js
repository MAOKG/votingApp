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

/* =======  Sever side rendering ========== */
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router-dom');
const _ = require('lodash');
const fs = require('fs');
const compression = require('compression');
const App = require('./client/js/App').default;

const StaticRouter = ReactRouter.StaticRouter;
const baseTemplate = fs.readFileSync('./index.html');
const template = _.template(baseTemplate);
/* ======================================== */

const PORT = process.env.PORT || 5000;
const server = express();

mongoose.connect(keys.mongoURI);

server.use(
  cookieSession({
    maxAge: 10 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());

server.use('/api/auth', authRoutes);
server.use('/api/polls', pollRoutes);

/* =======  Sever side rendering ========== */
if (process.env.NODE_ENV === 'production') {
  server.use(compression());
  server.use('/client/public', express.static('./client/public'));

  server.get('*', (req, res) => {
    console.log(req.url);
    const context = {};
    const body = ReactDOMServer.renderToString(
      React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
    );

    if (context.url) {
      res.redirect(context.url);
    }

    res.write(template({ body }));
    res.end();
  });
}
/* ======================================== */
server.listen(PORT, () => {
  console.log('Server is running!');
});
