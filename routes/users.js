/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  findUsers,
  findUsersById,
  createUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', findUsers);
router.get('/users/:id', findUsersById);
router.post('/users', createUsers);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
