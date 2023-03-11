const express = require('express');
const app = express();
const sso = require('./sso');

app.use(sso);
app.get('/', (req, res) => {
  res.status(200).send('SSO Test - You\'re Logged In! :)');
});

app.listen(3030);
