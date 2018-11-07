const express = require('express');
const router = express.Router();
const {
  isValid,
  isValidLogin,
  alreadRegistered,
  isAuthenticated
} = require('../middlewares/user-middlewares');
const { addUser, getUser, loginUser } = require('../models/users-model');

router.post('/register', isValid, alreadRegistered, async (req, res) => {
  const user = await addUser(req.body);
  user.token = user.genreateToken();
  const result = {
    name: user.name,
    email: user.email,
    token: user.genreateToken()
  };
  res.header('x-token', result.token).send(result);
});

router.post('/login', isValidLogin, async (req, res) => {
  const user = await loginUser(req.body);
  const result = {
    name: user.name,
    email: user.email,
    token: user.genreateToken()
  };
  res.status(200).send(result);
});

router.get('/whoami', isAuthenticated, async (req, res) => {
  const user = await getUser(req.user._id);
  res.send(user);
});

module.exports = router;
