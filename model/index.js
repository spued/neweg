const userAction = require('./action/user');
const dataAction = require('./action/user_data');
module.exports = {
  ...userAction,
  ...dataAction
};
