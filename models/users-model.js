const mongoose = require('mongoose');
const config = require('config');
const bcrybt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  },
  isAdmin: Boolean
});

userSchema.methods.genreateToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

async function getAllUsers() {
  const users = await User.find();
  return users;
}

async function getUser(id) {
  const user = await User.findById(id);
  return user;
}

async function loginUser(user) {
  const target = await User.findOne({ email: user.email }).catch(err =>
    console.log(err)
  );
  const validPassword = await bcrybt.compare(user.password, target.password);
  if (validPassword) {
    return target;
  }
}

async function addUser(user) {
  let target = new User({
    name: user.name,
    password: user.password,
    email: user.email,
    isAdmin: false
  });
  const salt = await bcrybt.genSalt(10);
  target.password = await bcrybt.hash(target.password, salt);
  target = await target.save();

  return target;
}

async function editUser(id, user) {
  let target = await User.findById(id);
  if (target) {
    (target.name = user.name), (target.email = user.email);
    target.password = user.password;
    target = await target.save();
  }
  return target;
}

async function promoteUser(id) {
  let target = await User.findById(id);
  target.isAdmin = true;
  target = await target.save();
  return target;
}

module.exports.User = User;
module.exports.addUser = addUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
module.exports.editUser = editUser;
module.exports.promoteUser = promoteUser;
module.exports.loginUser = loginUser;
module.exports.userSchema = userSchema;
