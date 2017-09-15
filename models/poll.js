const mongoose = require('mongoose');
const { Schema } = mongoose;

const pollSchema = new Schema({
  title: String,
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  options: [
    {
      name: String,
      votes: Number
    }
  ],
  peopleVoted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Poll', pollSchema);
