const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchame = new Schema({
  local : {
    username: String,
    password: String
  },
  google: {
    id: String
    name: String
  }
});

module.exports = mongoose.model('User', userSchame);
