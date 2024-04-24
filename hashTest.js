const bcrypt = require('bcryptjs');

const password = 'root'; // Use a known password
bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);

    // Now compare it immediately
    bcrypt.compare(password, hash, function(err, result) {
      if (result) {
        console.log('The passwords match.');
      } else {
        console.log('The passwords do not match.');
      }
    });
  }
});
