const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },  
  avatar: { type: String },        
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
