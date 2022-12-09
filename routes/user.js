const routes = require('express').Router();
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const httpStatus = require('http-status-codes');
const main = require('../controller/controller_main');

const { validating, logged } = require('../lib/middleware');
const db = require('../model');
const logger = require('../lib/logger');
const { PasswordNoMatch, PasswordHashFailed, DbNoResult } = require('../errors');

function hashPassword(pwd) {
  return new Promise((res, rej) => bcrypt.hash(pwd, bcrypt.genSaltSync(), (err, hash) => {
    if (err) rej(new PasswordHashFailed());
    else res(hash);
  }));
}

function isValidPassword(pwd, hash) {
  return new Promise((res, rej) => {
    bcrypt.compare(pwd, hash, (err, suc) => {
      if (err || !suc) rej(new PasswordNoMatch());
      else res(suc);
    });
  });
}

const userschema = Joi.object().keys({
  username: Joi.string().email().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  password_confirm: Joi.string().min(4).required(),
  full_name: Joi.string().min(3).max(128),
  company_name: Joi.string().min(3).max(128),
  phone_number: Joi.number().min(7),
  request_message: Joi.string(),
});

const authenSchema = Joi.object().keys({
  username: Joi.string().email().required(),
  password: Joi.string().min(4).required()
});

module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      let user = null;
      try {
        user = await db.getUserFromField('username', username);
      } catch (e) {
        if (e instanceof DbNoResult) {
          done(null, false, { error: 'Incorrect username.' });
          return;
        }
        done(e, false, { error: 'Internal server error' });
        return;
      }
      isValidPassword(password, user.password)
        .then(() => {
          done(null, user);
        })
        .catch(() => {
          done(null, false, { error: 'Incorrect password.' });
        });
    }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    db.getUserFromField('_id', id)
      .then(u => done(null, u))
      .catch((e) => {
        if (e instanceof DbNoResult) done(null, null);
        else done(e, null);
      });
  });

  routes.post('/register', validating(userschema), main.post_register_user);

  // Login using passport middleware
  routes.post('/login', validating(authenSchema),
    passport.authenticate('local'),
    main.login_user);

  // Simply logs out using passport middleware
  routes.post('/logout', async (req, res) => {
    await req.logout();
    req.session.save();
    req.session.user = '';
    return res.status(httpStatus.OK).send('successfuly logout');
  });

  const changePasswordSchema = Joi.object().keys({
    lastPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  });

  routes.post('/changepassword', logged, validating(changePasswordSchema), async (req, res) => {
    const { lastPassword } = req.value;
    const { newPassword } = req.value;

    try {
      const user = await db.getUserFromField('_id', req.user.id);
      await isValidPassword(lastPassword, user.password);
      const newhash = await hashPassword(newPassword);
      await db.modifyUserPassword(user.id, newhash);
      return res.status(httpStatus.OK).end();
    } catch (e) {
      if (e instanceof DbNoResult) return res.status(httpStatus.BAD_REQUEST).send({ error: 'User not found' });
      if (e instanceof PasswordNoMatch) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'password doesn\'t match' });
      logger.error(e);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Internal server error' });
    }
  });

  routes.get('/me', logged, (req, res) => res.status(httpStatus.OK).send(req.user));

  return routes;
};
