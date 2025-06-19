// generate-hash.js
const bcrypt = require('bcryptjs');

const password = 'admin1234'; // Change this to your actual password
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error('Hashing failed:', err);
    process.exit(1);
  }
  console.log('Hashed password:', hash);
});
