const express = require('express');
const {
  createShrink,
  editShrink,
  deleteShrink,
  getMyShrinks
} = require('../models/urls-model');
const { isValid, doesExist } = require('../middlewares/urls-middleware');
const { isAuthenticated } = require('../middlewares/user-middlewares');
const router = express.Router();

router.get('/mylinks', isAuthenticated, async (req, res) => {
  const shrinks = await getMyShrinks(req.user._id);
  res.status(200).send(shrinks);
});

router.post('/create', isAuthenticated, isValid, async (req, res) => {
  const regex = /(https:\/\/|http:\/\/)(.+)/gi;
  if (!regex.test(req.body.original)) {
    req.body.original = `https://${req.body.original}`;
  }
  const shrink = await createShrink(req.body, req.user._id);
  res.status(200).send(shrink);
});

const putmiddlares = [isAuthenticated, doesExist, isValid];
router.put('/edit/:id', putmiddlares, async (req, res) => {
  const result = await editShrink(req.params.id, req.body);
  res.status(200).send(result);
});

router.delete('/delete/:id', isAuthenticated, doesExist, async (req, res) => {
  const result = await deleteShrink(req.params.id);
  res.status(200).send(result);
});

module.exports = router;
