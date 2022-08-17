const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const {
  login,
  createUsers,
} = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');
const { NotFound } = require('./errors/NotFound');

const { REG_LINK } = require('./const/const');

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REG_LINK),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUsers);

app.use(isAuthorized);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFound('404 - Страницы не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: err });

  return next();
});

app.listen(PORT, () => {
});
