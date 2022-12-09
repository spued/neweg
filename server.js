const papa = require('papaparse');
const favicon = require('serve-favicon');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const helmet = require('helmet');
const mongoose  = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path')


// set the view engine to ejs
app.set('view engine', 'ejs');

const logger = require('./lib/logger');

let allowedCORS;

if (process.env.CORS_WHITELIST) [allowedCORS] = papa.parse(process.env.CORS_WHITELIST).data;
else logger.warn('no allowed CORS found');

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCORS && allowedCORS.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin);

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Authorization, '
    + 'x-id, Content-Length, X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');

  next();
});

app.use(helmet());
app.use('/pub', express.static(__dirname + '/pub'))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use(cookieParser());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(session({
  secret: 'ewrew3432fdg5456gr54ty5tv3w4tr3t534trw4rqw4',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: 'mongodb://'+ process.env.MONGODB_ENDPOINT +'/aarx_db',
    mongoOptions : { useUnifiedTopology: true },
    ttl: 14 * 24 * 60 * 60
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev', {
  skip: (req) => {
    if (req.url === '/health') return true;
    return false;
  },
  stream: logger.stream,
}));

//app.use(require('./routes/user')(passport));
app.use(require('./routes/main')(passport));

app.use(favicon(__dirname + '/pub/img/favicon.ico'));

app.listen(8081,() => logger.info('Listening on ' + process.env.APP_PORT));

module.exports = app;
