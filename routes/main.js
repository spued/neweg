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
const deviceman = require('../controller/controller_deviceman');
const dashboad = require('../controller/controller_dashboard');

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
      passport.authenticate('local', { failureRedirect: '/login_failed', failureMessage: true }),
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
  
    routes.get('/', isLogged, main.getDashboardPage);
    routes.get('/logout', isLogged, main.getLogoutPage);
    routes.get('/login', isLogged, main.getLoginPage);
    routes.get('/login_failed', main.getLoginFailedPage);
    routes.get('/register_request', main.getRegisterPage);
    routes.get('/user_man', isLogged, main.getUserMan);
    routes.get('/user_setting', isLogged, main.getUserSetting);

    routes.get('/dashboard', isLogged, main.getDashboardPage);
    routes.get('/deviceman', isLogged, deviceman.getDeviceManPage);

    routes.post('/logout', isLogged, main.post_logout_user);
    routes.post('/list_user', main.post_list_users);
    routes.post('/list_user_sessions', main.post_list_user_sessions);
    routes.post('/list_user_logs', main.post_list_user_logs);
    routes.post('/user_save', main.post_save_user);
    routes.post('/user_delete', main.post_delete_user);
    routes.post('/user_password', main.post_password_user);

    routes.post('/search_device', deviceman.post_search_device);
    routes.post('/device_refresh_params', deviceman.post_refresh_params);
    routes.post('/device_get_params', deviceman.post_query_params);

    routes.post('/user_note_save', deviceman.post_user_note_save);
    routes.post('/user_note_load', deviceman.post_user_note_load);
    routes.post('/system_save', deviceman.post_system_save);
    routes.post('/lan_save', deviceman.post_lan_save);
    routes.post('/wlan_save', deviceman.post_wlan_save);
    routes.post('/wlan_neighbor', deviceman.post_wlan_neighbor);
    routes.post('/voip_save', deviceman.post_voip_save);
    routes.post('/ddns_save', deviceman.post_ddns_save);
    routes.post('/port_forward_save', deviceman.post_port_forward_save);
    routes.post('/port_forward_add', deviceman.post_port_forward_add);
    routes.post('/port_forward_delete', deviceman.post_port_forward_delete);
    routes.post('/device_reboot', deviceman.post_device_reboot);
    routes.post('/device_history_save',deviceman.post_device_history_save);
    routes.post('/device_history_load',deviceman.post_device_history_load);

    routes.post('/dashboard_prefix', dashboad.post_user_prefix);
    routes.post('/dashboard_prefix_data', dashboad.post_graph_prefix);
    return routes;
};