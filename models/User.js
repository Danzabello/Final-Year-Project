const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI)

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Duplicate Email Not allowed'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required']
  },
  name: { 
    type: String, 
  },
  birthday: { 
    type: Date 
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'admin']
  }
  // include other fields as necessary
});

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const DublinCoreSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: [true, 'Identifier is required'],
    unique: [true, 'Duplicate Identifier Not allowed'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  alternative: {
    type: String,
    trim: true
  },
  creator: {
    type: String,
    required: [true, 'Creator is required'],
    trim: true
  },
  created: {
    type: Date,
    required: [true, 'Creation date is required']
  },
  issued: {
    type: Date,
  },
  description: {
    type: String,
    trim: true
  },
  rights: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  contributor: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  coverage: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  // Add any other fields you require according to the Dublin Core standard
}, { collection: 'michaelCooleyCollection' });



module.exports = {
  User: mongoose.model('User', UserSchema),
  DublinCore: mongoose.model('DublinCore', DublinCoreSchema)
};

