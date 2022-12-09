const routes = require('express').Router();
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const httpStatus = require('http-status-codes');
const { validating, isLogged } = require('../lib/middleware');
const db = require('../model');
const logger = require('../lib/logger');
const { PasswordNoMatch, PasswordHashFailed, DbNoResult, StatusError } = require('../errors');
const main = require('../controller/controller_main');
const rx_onu = require('../controller/controller_aarx_onu');
const tx_onu = require('../controller/controller_tx_onu');

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

function isEnable(status) {
  return new Promise((resolve, reject) => {
    //console.log("status = "  + status)
    if(status == 1) resolve(true);
    else reject(new StatusError());
  });
}

const userschema = Joi.object().keys({
  username: Joi.string().email().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  password_confirm: Joi.string().min(4).required(),
  full_name: Joi.string().min(3).max(128),
  company_name: Joi.string().min(2).max(128),
  phone_number: Joi.number().min(7),
  request_message: Joi.string(),
});

const authenSchema = Joi.object().keys({
  username: Joi.string().email().required(),
  password: Joi.string().min(4).required()
});

const changePasswordSchema = Joi.object().keys({
    lastPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
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
        .then(async () => { 
            if(await isEnable(user.status)) {
              done(null, user);
            } else {
              done(e, false, { error: 'User not enable' });
            }
          }
        )
        .catch(() => {
          done(null, false, { error: 'Incorrect password.' });
        });
      }));
  
    passport.serializeUser((user, done) => {
      //console.log('Serialize user = ' + user._id);
      process.nextTick(function() {
        done(null, user._id);
      })
    });

    passport.deserializeUser((id, done) => {
      //console.log('Deserialize id = ' + id);
      process.nextTick(function() {
        db.getUserFromField('_id', id)
        .then(u => done(null, u))
        .catch((e) => {
            if (e instanceof DbNoResult) done(null, null);
            else done(e, null);
        });
      })
    });

    routes.post('/register', validating(userschema), main.post_register_user);
  
    // Login using passport middleware
    routes.post('/login', validating(authenSchema),
      passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
      main.post_login_user);
  
    // Simply logs out using passport middleware
    routes.post('/logout', main.post_logout_user);
    routes.post('/changepassword', isLogged, validating(changePasswordSchema), async (req, res) => {
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
  
    routes.get('/me', isLogged, (req, res) => res.status(httpStatus.OK).send(req.user));
    routes.get('/', isLogged, main.getMainPage);
    routes.get('/aarx_onu', isLogged, main.getAarxOnuPage);
    routes.get('/tx_onu', isLogged, main.getTxOnuPage);
    routes.get('/logout', isLogged, main.getLogoutPage);
    routes.get('/login', isLogged, main.getLoginPage);
    routes.get('/register_request', main.getRegisterPage);
    routes.get('/user_man', isLogged, main.getUserMan);
    routes.get('/user_setting', isLogged, main.getUserSetting);

    routes.post('/logout', isLogged, main.post_logout_user);
    routes.post('/list_ne', main.post_list_ne);
    routes.post('/list_user', main.post_list_users);
    routes.post('/list_user_sessions', main.post_list_user_sessions);
    routes.post('/list_user_logs', main.post_list_user_logs);
    routes.post('/user_save', main.post_save_user);
    routes.post('/user_delete', main.post_delete_user);
    routes.post('/user_password', main.post_password_user);
    
    routes.post('/list_pon', isLogged, rx_onu.post_rx_province);
    routes.post('/list_masters', isLogged, rx_onu.post_masters_info);
    routes.post('/list_master_id', isLogged, rx_onu.post_list_master_id);
    routes.post('/count_pon', isLogged, rx_onu.post_count_pon);
    routes.post('/rx_count_onu', isLogged, rx_onu.post_rx_onu_count);
    routes.post('/rx_count_pon', isLogged, rx_onu.post_rx_pon_count);
    routes.post('/rx_pon_onu', isLogged, rx_onu.post_pon_onu);
    routes.post('/list_nc_onu', isLogged, rx_onu.post_list_nc_onu);
    routes.post('/list_nc_history_onu', isLogged, rx_onu.post_list_nc_history);

    routes.post('/tx_count_onu', isLogged, tx_onu.post_tx_onu_count);
    routes.post('/tx_get_nc_onu', isLogged, tx_onu.post_tx_nc_onu);

    return routes;
};