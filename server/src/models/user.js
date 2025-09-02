const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  msisdn: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/
  },
  name: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    enum: ['vodacom', 'mtn', 'cellc', 'telkom'],
    default: 'vodacom',
    required: true
  },
  airtime: {
    type: Number,
    default: () => Math.floor(Math.random() * 61) + 20, // 20 to 80
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
