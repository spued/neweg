const userAction = require('./action/user');
const deviceAction = require('./action/devices');
const dataAction = require('./action/user_data');
module.exports = {
  ...userAction,
  ...deviceAction,
  ...dataAction
};
