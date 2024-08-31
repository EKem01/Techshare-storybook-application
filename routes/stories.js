const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuset} = require('../helpers/auth');

// stores page
router.get('/', (req, res) => {
  Story.find({status: 'public'})
  .populate('user')
  .then(stories => {
    res.render('stories/index', {stories: stories});
  });
});

// add stories form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});


// Process add story
router.post('/', ensureAuthenticated, async (req, res) => {
   let allowComments;

   if(req.body.allowComments) {
     allowComments = true;
   } else {
    allowComments = false;
   }

   const newStory = {
     title: req.body.title,
     body: req.body.body,
     status: req.body.status,
     user: req.user.id,
     allowComments: allowComments
   };
   
   // create a new story
    await new Story(newStory).save();
    res.redirect(`/stories/show/${Story.id}`);
});

module.exports = router;