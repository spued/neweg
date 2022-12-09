const Joi = require('joi');
const httpStatus = require('http-status-codes');

const validating = schema => (req, res, next) => {
  const { error, value } = Joi.validate(req.body, schema);
  if (error) return res.render('pages/register_failed');
  //res.status(httpStatus.BAD_REQUEST).send(error);
  req.value = value;
  return next();
};

const isLogged = (req, res, next) => {
  //console.log(req.isAuthenticated());
  if (req.isAuthenticated()) { return next() }
  console.log("Controller: Main: Not logged in");
  res.render('pages/login');
};

module.exports = { validating, isLogged };
