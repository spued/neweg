const userAction = require('./action/user');
const dataAction = require('./action/onu_data');
module.exports = {
  ...userAction,
  ...dataAction
};
