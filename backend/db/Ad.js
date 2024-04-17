const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    googleId: String,
    accessToken: String,
    refreshToken: String
});

const Ad = mongoose.model('Ad', userSchema);

module.exports = Ad;