const router = require('express').Router();
const {
  findUsers,
  findUsersById,
  createUsers,
  updateProfile,
  updateAvatar,
  returnUser,
} = require('../controllers/users');

router.get('/users', findUsers);
router.get('/users/:id', findUsersById);
router.get('/users/me', returnUser);

router.post('/users', createUsers);

router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
