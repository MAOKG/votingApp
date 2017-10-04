const mongoose = require('mongoose');

const { Schema } = mongoose;

const pollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  options: [
    {
      name: {
        type: String,
        required: true
      },
      votes: {
        type: Number,
        required: true
      }
    }
  ],
  peopleVoted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  voteNum: {
    type: Number,
    required: true
  },
  isUserOption: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Poll', pollSchema);
