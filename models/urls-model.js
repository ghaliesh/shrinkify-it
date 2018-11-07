const mongoose = require('mongoose');
const Chance = require('chance');
const { getUser } = require('../models/users-model');
const urlSchema = new mongoose.Schema({
  original: {
    type: String,
    minlength: 5,
    maxlength: 300
  },
  shrinked: String,
  visited: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    name: String,
    email: String
  },
  userId: String // this is a navigating property
});

const Shrink = mongoose.model('Shrink', urlSchema);

async function getShrink(id) {
  const shrink = await Shrink.findById(id).catch('does not exist');
  return shrink;
}

async function getMyShrinks(id) {
  console.log(id);

  const shrinks = await Shrink.find({ userId: id }).sort('-createdAt');
  return shrinks;
}

async function getOriginal(shrink) {
  let url = await Shrink.findOne({ shrinked: shrink }).catch(err =>
    console.log(err)
  );
  if (url) {
    url.visited += 1;
    url = await url.save();
    return url.original;
  }
}

async function createShrink(added, id) {
  const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const chance = new Chance();
  let shrinked = chance.string({ length: 5, pool: pool });
  const user = await getUser(id);
  let url = new Shrink({
    original: added.original,
    shrinked,
    user: {
      _id: id,
      name: user.name,
      email: user.email
    },
    userId: user._id
  });
  url = await url.save();
  return url;
}

async function editShrink(id, url) {
  let target = await Shrink.findById(id);
  target.original = url.original;
  target = await target.save();
  return target;
}

async function deleteShrink(id) {
  let target = await Shrink.findById(id);
  target = await target.remove();
  return target;
}

async function getRandomString() {
  const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const chance = new Chance();
  let shrink = chance.string({ length: 5, pool: pool });
  if (await previouslyGenerated(shrink)) {
    shrink = chance.string({ length: 6, pool: pool });
  }
  return shrink;
}

async function previouslyGenerated(random) {
  console.log('shrink is');
  const shirnk = await Shrink.findOne({ shrink: random }).catch(res =>
    console.log('Not registered before.')
  );
  if (shrink == null) {
    return false;
  } else {
    return true;
  }
}

module.exports.getShrink = getShrink;
module.exports.getOriginal = getOriginal;
module.exports.getMyShrinks = getMyShrinks;
module.exports.createShrink = createShrink;
module.exports.editShrink = editShrink;
module.exports.deleteShrink = deleteShrink;
module.exports.Shrink = Shrink;
module.exports.urlSchema = urlSchema;
