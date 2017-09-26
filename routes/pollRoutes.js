const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();

const Poll = mongoose.model('Poll');
router.use(cors());

// Index - show all polls
router.get('/', (req, res) => {
  // Get all polls from DB
  Poll.find({})
    .select('title voteNum author postDate')
    .exec((err, allPolls) => {
      if (err) {
        // handle err
        res.send({ error: err });
      } else {
        res.send({ polls: allPolls });
      }
    });
});

// Create a new post
router.post('/', (req, res) => {
  if (req.isAuthenticated()) {
    // Server side validation
    let newPoll = new Poll();
    newPoll.title = req.body.title;
    const authorName = req.user.local ? req.user.local.firstName : req.user.google.name;
    newPoll.author = { id: req.user._id, name: authorName };
    newPoll.options = [];
    for (let i = 0; i < req.body.options.length; i++) {
      newPoll.options.push({ name: req.body.options[i], votes: 0 });
    }
    newPoll.peopleVoted = [];
    newPoll.voteNum = 0;
    newPoll.save(err => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send({ poll: newPoll });
      }
    });
  } else {
    res.send({ message: 'Please log in first' });
  }
});

// Show - shows more info about one poll
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id, (err, foundPoll) => {
    if (err || !foundPoll) {
      res.send({
        error: 'No poll found',
        poll: { _id: req.params.id }
      });
    } else {
      let resObj = { hasVoted: false, isOwner: false, poll: foundPoll };
      if (req.isAuthenticated()) {
        if (contains(foundPoll.peopleVoted, req.user._id)) {
          // user already voted
          resObj.hasVoted = true;
        }
        if (foundPoll.author.id.equals(req.user._id)) {
          // user own the poll
          resObj.isOwner = true;
        }
      }
      res.send(resObj);
    }
  });
});

// Update Poll - user vote or add option
router.put('/:id', (req, res) => {
  // is user logged in
  if (req.isAuthenticated()) {
    Poll.findById(req.params.id, (err, foundPoll) => {
      if (err || !foundPoll) {
        // handle err
        res.send({ error: 'No poll found' });
      } else {
        // Has the user voted
        if (contains(foundPoll.peopleVoted, req.user._id)) {
          // user has already voted
          res.send({ message: 'User already voted' });
        } else {
          // update poll
          let index = foundPoll.options.findIndex(option => option.name === req.body.option);
          if (index == -1) {
            // User adds new option
            foundPoll.options.push({ name: req.body.option, votes: 1 });
          } else {
            // User votes existing option
            foundPoll.options[index].votes += 1;
          }
          foundPoll.voteNum += 1;
          foundPoll.peopleVoted.push(req.user._id);
          foundPoll.save(err => {
            if (err) {
              res.send({ error: err });
            } else {
              res.send({ poll: foundPoll });
            }
          });
        }
      }
    });
  } else {
    // user is not logged in
    res.send({ message: 'User nedds to be logged in ' });
  }
});

// Destroy Poll route
router.delete('/:id', (req, res) => {
  // is user logged in
  if (req.isAuthenticated()) {
    // does user own the poll?
    Poll.findById(req.params.id, (err, foundPoll) => {
      if (err || !foundPoll) {
        // handle err
        res.send({ error: 'No poll found' });
      } else {
        // does user own the poll?
        if (foundPoll.author.id.equals(req.user._id)) {
          foundPoll.remove(err => {
            if (err) {
              res.send({ error: err });
            } else {
              res.send({ success: 'Poll successfully deleted' });
            }
          });
        } else {
          // User does not own the poll
          res.send({ message: 'You do not own the poll' });
        }
      }
    });
  } else {
    // user is not logged in
    res.send({ message: 'You are not logged in' });
  }
});

// Helper function to check if user has voted
const contains = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].equals(id)) {
      return true;
    }
  }
  return false;
};

module.exports = router;
