/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    ref: '',
    default: 'https://www.meme-arsenal.com/memes/8fc38e10957222a768e19d5518874471.jpg',
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
