const express = require('express');
const app = express();
const user = require('./routes/user-route');
var path = require('path');
const { getOriginal } = require('./models/urls-model');
const morgan = require('morgan');
const url = require('./routes/urls-route');
const mongoose = require('mongoose');
const MONGOURI = process.env.MONGOURI;

// set static folder
app.use(express.static(__dirname + '/client/dist/client'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname));
});

mongoose
  .connect(
    MONGOURI,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/urls', url);
app.use('/api/users', user);

app.get('/:shrink', async (req, res) => {
  const original = await getOriginal(req.params.shrink);
  res.redirect(original);
});

const port = process.env.PORT || 56134;
app.listen(port, () => {
  console.log(`Shrinkify - ${process.env.NODE_ENV}`);
  console.log(`Listening on port ${port}`);
});
