const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchame = new Schema({
  googleId: String
});

module.exports = mongoose.model('User', userSchame);
