const userAction = require('./action/user');
const deviceAction = require('./action/devices');
const taskAction = require('./action/tasks');
const dataAction = require('./action/user_data');
module.exports = {
  ...userAction,
  ...deviceAction,
  ...taskAction,
  ...dataAction
};
