/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  returnCards,
  createCards,
  deleteCards,
  setLike,
  unsetLike,
} = require('../controllers/cards');

router.get('/cards', returnCards);
router.post('/cards', createCards);
router.delete('/cards/:cardId', deleteCards);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', unsetLike);

module.exports = router;
