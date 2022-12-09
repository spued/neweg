const db = require('../model');
const logger = require('../lib/logger');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { PasswordNoMatch, PasswordHashFailed, DbNoResult } = require('../errors');


function hashPassword(pwd) {
  return new Promise((res, rej) => bcrypt.hash(pwd, bcrypt.genSaltSync(), (err, hash) => {
    if (err) rej(new PasswordHashFailed());
    else res(hash);
  }));
}

const getLoginPage = (req,res) => {
    console.log("Controller: Main: Get login page");
    let message = {
      failureMessage : false
    };
    res.render('pages/login', message);
}
const getLogoutPage = async (req,res) => {
  console.log("Controller: Main: Get logout page");
  await req.logout();
  console.log("Controller: Main: Successfuly logout");
  res.render('pages/login');
}
const getMainPage = (req,res) => {
  //console.log(req.user);
  console.log("Controller: Main: Get main page for " + req.user.fullname);
  res.render('pages/main_page', req.user);
}
const getRegisterPage = (req,res) => {
    console.log("Controller: Main: Get register page");
    res.render('pages/register');
}
const getAarxOnuPage = (req,res) => {
  console.log("Controller: Main: Get AARX ONU page");
  /* db.getOverAllNEData().then(function(rows) {
      // now you have your rows, you can see if there are <20 of them
        //console.log(rows);
  }).catch((err) => setImmediate(() => { throw err; })); */
  res.render('pages/aarx_onu', req.user);
}
const getTxOnuPage = (req,res) => {
  console.log("Controller: Main: Get TX ONU page");
  /* db.getOverAllNEData().then(function(rows) {
      // now you have your rows, you can see if there are <20 of them
        //console.log(rows);
  }).catch((err) => setImmediate(() => { throw err; })); */
  res.render('pages/tx_onu', req.user);
}
const getUserMan = (req,res) => {
  //console.log(req.user);
  console.log("Controller: Main: Get user manager page for " + req.user.fullname);
  res.render('pages/user_man', req.user);
}

const getUserSetting = (req,res) => {
  //console.log(req.session);
  console.log("Controller: Main: Get user setting page for " + req.user.fullname);
  res.render('pages/user_setting', req.user);
}

const post_login_user = async (req, res, next) => {
  console.log("Controller: Main: User logged in = " + req.user.fullname);
  await req.login(req.user, function(err) {
    if (err) { return next(err); }
    console.log(req.user);
    db.pumpLog({
      user_id: req.user._id,
      username: req.user.username,
      action: 'Logged in'
    });
    return res.render('pages/main_page', req.user);
  });
}
const post_logout_user = async (req, res) => {
  console.log("Controller: Main: User logged out = " + req.user.fullname);
  resData = {
    code : 1,
    msg : 'Error : Default' 
  };
  db.pumpLog({
    user_id: req.user._id,
    username: req.user.username,
    action: 'Logged out'
  });
  await req.logout();
  req.session.save();
  req.session.user = '';
  resData.code = 0;
  resData.msg = 'Logged out';
  //res.render('pages/login', resData);
  res.json(resData);
}
const post_register_user = async (req, res) => {
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    //console.log(req.body);
    const h_password = await hashPassword(req.body.password);
    const _uuid = uuidv4();
    const user_data = {
      email : req.body.username,
      username : req.body.username,
      uuid : _uuid,
      password : h_password,
      //password_confirm : req.password_confirm,
      fullname : req.body.full_name,
      company : req.body.company_name,
      message : req.body.request_message
    };
    

    try {
      const exist = await db.userExist('email', req.body.username);
      if (exist) {
        resData.code = 409;
        resData.msg = 'User already exist or an error occured';
        res.render('pages/register_failed', resData);
      }
      await db.addUser(user_data);
      resData.code = 0;
      resData.msg = 'OK';
      db.pumpLog({
        user_id: 'not assigned',
        username: req.body.username,
        action: 'Register to system'
      });
      res.render('pages/register_ok', resData);
    } catch (e) {
      logger.error(e);
      resData.code = 500;
      resData.msg = 'Internal error occured';
      res.render('pages/register_failed', resData);
    }
}

const post_list_users = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default'
  };
  resData.data = await db.list_user({});
  resData.code = 0;
  resData.msg = "OK";
  res.json(resData);
}

const post_list_user_sessions = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default'
  };
  var sessions_data = [];
  const user_session_data = await db.listUserSessions({});
  //console.log(user_session_data);
  for(item of user_session_data){
    //console.log(item);
    let user_data = JSON.parse(item.session);
    console.log(user_data.passport.user);
    if(user_data.passport.user != undefined) {
      let user_detail =await db.getUserFromID(user_data.passport.user);
      //console.log(user_detail);
      let _data = {
        expires : item.expires,
        username : user_detail.fullname,
        email : user_detail.email,
        company : user_detail.company,
        type : user_detail.type
      };
      sessions_data.push(_data);
    }
  }
  resData.data = sessions_data;
  resData.code = 0;
  resData.msg = "OK";
  //console.log(resData.data);
  res.json(resData);
}

const post_list_user_logs = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default'
  };
  const user_logs_data = await db.listUserLogs({});
  resData.data = user_logs_data;
  resData.code = 0;
  resData.msg = "OK";
  //console.log(resData.data);
  res.json(resData);
}

const post_save_user = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default',
      data : {}
  };
 // console.log(req.body);
  try {
    const exist = await db.userExist('email', req.body.email);
    if (exist) {
      resData.code = 409;
      resData.msg = 'User already exist or an error occured';
      res.json(resData);
    } else {
      resData.data = await db.save_user(req.body);
      resData.code = 0;
      resData.msg = "OK";
      //console.log(resData.data);
      db.pumpLog({
        user_id: req.user._id,
        username: req.user.username,
        action: 'Save data for user = ' + req.body.email
      });
      res.json(resData);
    }
  } catch (e) {
    logger.error(e);
    resData.code = 500;
    resData.msg = 'Internal error occured';
    res.json(resData);
  }
}

const post_delete_user = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default',
      data : {}
  };
  //console.log(req.body);
  if(req.body.type == 'admin') {
    resData.code = 2;
    resData.msg = "Can not delete user.";
  } else {
    resData.data = await db.delete_user(req.body);
    resData.code = 0;
    db.pumpLog({
      user_id: req.user._id,
      username: req.user.username,
      action: 'Delete data for user = ' + req.body.user_id
    });
    resData.msg = "OK";
  }
  //console.log(resData.data);
  res.json(resData);
}

const post_password_user = async (req, res) => {
  resData = {
      code : 1,
      msg : 'Error : Default',
      data : {}
  };
 // console.log(req.body);
  const passwd = await hashPassword(req.body.passwd)
  resData.data = await db.modifyUserPassword(req.body.user_id, passwd);
  resData.code = 0;
  resData.msg = "OK";
  //console.log(resData.data);
  db.pumpLog({
    user_id: req.user._id,
    username: req.user.username,
    action: 'Change password for user = ' + req.body.user_id
  });
  res.json(resData);
}
function parseUserRight(data) {
  let province = null;
  let rights = [];
  if(!data) {
    return 0;
  } else {
    province = data.split(',');
    if(province.length) {
      province.forEach(function(item) {
        let _right = item.split(':');
        if(_right.length == 2) {
          rights.push({
          name : _right[0].trim(),
          prefix: _right[1]
          })
        }
      })
    }
    return rights;
  }
}
const post_list_ne = async (req, res) => {
  logger.info("Controller : NE list command.");
  let rights = parseUserRight(req.user.right);
  //console.log(rights)
  resData = {
      code : 1,
      msg : 'Error : Default',
      data : []
  };
  var right_regex = "";
  rights.forEach((item)=> {
    right_regex += item.prefix + '|'
  })
  var _right_regex = '^(' + right_regex.slice(0,-1) + ').*';
   console.log(right_regex);
  db.getOverAllNEData(_right_regex).then((rows) => {
  //console.log(rows);
    resData.data = rows;
    resData.rowCount = rows.length;
    resData.rights = rights;
    resData.code = 0;
    resData.msg = "OK";
    res.json(resData);
  })
}
module.exports = {
    getLoginPage,
    getLogoutPage,
    getMainPage,
    getRegisterPage,
    getAarxOnuPage,
    getTxOnuPage,
    getUserMan,
    getUserSetting,

    post_list_user_sessions,
    post_list_user_logs,
    post_register_user,
    post_login_user,
    post_logout_user,
    post_list_users,
    post_list_ne,
    post_save_user,
    post_delete_user,
    post_password_user
}