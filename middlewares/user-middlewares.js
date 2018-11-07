const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models/users-model');

function isAuthenticated(req, res, next) {
  const token = req.header('x-token');
  if (!token) return res.status(401).send('Access denied.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Token is not verified');
  }
}

function isValid(req, res, next) {
  const schemas = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  const { error } = Joi.validate(req.body, schemas, { abortEarly: false });
  if (!error) {
    next();
  } else {
    const errorMessages = [];
    error.details.forEach(a => errorMessages.push(a.message));
    res.status(400).send(errorMessages);
  }
}

function isValidLogin(req, res, next) {
  const schemas = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  const { error } = Joi.validate(req.body, schemas, { abortEarly: false });
  if (!error) {
    next();
  } else {
    const errorMessages = [];
    error.details.forEach(a => errorMessages.push(a.message));
    res.status(400).send(errorMessages);
  }
}

async function alreadRegistered(req, res, next) {
  const user = await User.findOne({ email: req.body.email }).catch(err =>
    console.log('user is already registered')
  );

  if (!user) {
    next();
  } else {
    res
      .status(400)
      .send(
        `User with the given email - ${req.body.email} - is already registered.`
      );
  }
}

async function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    console.log(req.user);
    res.status(403).send('Forbidden');
  }
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.isAdmin = isAdmin;
module.exports.isValid = isValid;
module.exports.isValidLogin = isValidLogin;
module.exports.alreadRegistered = alreadRegistered;
