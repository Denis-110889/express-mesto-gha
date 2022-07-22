/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const routes = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();
const create = (req, res, next) => {
  req.user = {
    _id: '62d965d0b856d0271cede4b5' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(create);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log('Сервер express запущен');
  console.log(__dirname);
});
