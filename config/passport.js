const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Using email as the username
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Convert email to lowercase before querying the database
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      // Check if the passwords match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      // Successful match
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


module.exports = passport;
