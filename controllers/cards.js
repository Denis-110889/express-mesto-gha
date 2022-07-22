/* eslint-disable no-console */
const Card = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NoValidId } = require('../errors/NoValidId');

const returnCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }); });
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные при создания карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCards = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardDeleted) => res.send(cardDeleted))
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidId('404 - Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidId('404 — Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

const unsetLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoValidId('404 — Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  returnCards,
  createCards,
  deleteCards,
  setLike,
  unsetLike,
};
