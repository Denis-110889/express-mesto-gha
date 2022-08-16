const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { NoValidId } = require('../errors/NoValidId');
const { CastError } = require('../errors/CastError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const createUsers = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const data = {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        };
        res.status(201).send(data);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('409 - Пользователь с такой почтой уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('400 - Некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

const findUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const returnUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const findUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NoValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidId('404 - Пользователь с несуществующим в БД id'));
      } else if (err.name === 'CastError') {
        next(new CastError('400 —  Пользователь с некорректным id'));
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
      new: true,
      runValidators: true,
    },
  )
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Некорректные данные при обновлении профиля'));
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
      new: true,
      runValidators: true,
    },
  )
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Некорректные данные при обновлении аватара'));
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
  login,
  returnUser,
};
