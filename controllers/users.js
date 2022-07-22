/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
const User = require('../models/user');
const { ValidationError } = require('../errors/ValidationError');
const { NoValidId } = require('../errors/NoValidId');
const { CastError } = require('../errors/CastError');

const findUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }); });
};

const findUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidId('404 - Получение пользователя с несуществующим в БД id'));
      } else if (err.message === 'CastError') {
        next(new CastError('400 —  Получение пользователя с некорректным id'));
      } else {
        next(err);
      }
    });
};

const createUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, //then получит на вход обновлённую запись
      runValidators: true, //валидация данных при изменении
    },
  )
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, //then получит на вход обновлённую запись
      runValidators: true, //валидация данных при изменении
    },
  )
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  findUsers,
  findUsersById,
  createUsers,
  updateProfile,
  updateAvatar,
};
