const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const moment = require('moment'); // Import moment
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

router.post('/register', async (req, res) => {
  try {
    let { email, password, confirm_password, name, birthday, role } = req.body;
    email = email.toLowerCase();

    if (password !== confirm_password) {
      return res.status(400).send('Passwords do not match.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('A user with that email already exists.');
    }

    // Parse and validate the birthday date using moment.js
    const formattedBirthday = moment(birthday, "DD MMMM YYYY");
    if (!formattedBirthday.isValid()) {
      return res.status(400).send('Invalid birthday date.');
    }

    // Validate the role
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).send('Invalid role selected.');
    }

    const newUser = new User({
      name,
      email,
      password, // Make sure to hash the password before saving it
      birthday: formattedBirthday.toDate(), // Convert to JavaScript Date
      role
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during registration.');
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.redirect('/login'); // Redirect or handle error
    }
    req.logIn(user, (err) => {
      if (err) { 
        return next(err); 
      }
      return res.redirect('/dashboard'); // Redirect to dashboard after successful login
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
  });
});

// Example protected route
router.get('/profile', isAuthenticated, (req, res) => {
  res.send('Profile page, only logged in users can see this.');
});

module.exports = router;