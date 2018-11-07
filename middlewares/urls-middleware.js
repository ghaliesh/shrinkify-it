const Joi = require('joi');
const { getShrink } = require('../models/urls-model');

function doesExist(req, res, next) {
  const shrink = getShrink(req.params.id);
  if (shrink) {
    next();
  } else {
    res.status(404).send(`The shrink of the id ${req.params} doesn't exist`);
  }
}

function isValid(req, res, next) {
  const schema = {
    original: Joi.string().min(5)
  };
  const { error } = Joi.validate(req.body, schema);
  if (!error) {
    next();
  } else {
    res.status(400).send(error.details[0].message);
  }
}

module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
