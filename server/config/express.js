const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const accountsRouter = require('../routes/accounts.server.routes');
const profilesRouter = require('../routes/profiles.server.routes');
const pdfRouter = require('../routes/pdf.server.routes');
const config = require('./config');


module.exports.init = () => {
  /*
        connect to database
        - reference README for db uri
    */
  mongoose.connect(process.env.DB_URI || config.db.uri, {
    useNewUrlParser: true,
  });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  // initialize app
  const app = express();

  app.set('trust proxy', 1);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  }));

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // add a router
  app.use('/api/accounts', accountsRouter);
  app.use('/api/profiles', profilesRouter);
  app.use('/api/pdf', pdfRouter);

  if (process.env.NODE_ENV === 'production') {
  // Serve any static files
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
  }

  return app;
};
