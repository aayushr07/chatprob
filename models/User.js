// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String, // From Google OAuth
  },
  contacts: [
    {
      type: String, // Email or UserID of contact
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
