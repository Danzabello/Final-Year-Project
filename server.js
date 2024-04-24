// server.js

// Import necessary modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Logging middleware
const flash = require('connect-flash'); // Required for flash messages
require('dotenv').config();

// Verify essential environment variables
if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) {
    console.error("Critical environment variables are missing.");
    process.exit(1); // Exit with error
}

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error: ", err));

// Logging middleware for development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser for parsing application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up express-session middleware with enhanced security in production
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
      secure: process.env.NODE_ENV === 'production', // Set secure to true if serving over HTTPS
      httpOnly: true, // Mitigate XSS
      maxAge: 24 * 60 * 60 * 1000 // Cookie expiration set to 24 hours
  }
}));

// Use connect-flash for flash messages stored in session
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Centralized Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
