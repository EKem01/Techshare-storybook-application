const express = require('express');
const router = express.Router();
const passport = require('passport');


// Google Strategy authentication
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));



router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect('/');
    });
  });

module.exports = router;