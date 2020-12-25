'use strict';

const config = require('../config');

const mongoose = require('mongoose');
mongoose.connect(config.dbURI, {useNewUrlParser: true,useUnifiedTopology: true});

mongoose.Promise = global.Promise;
// Log an error if the connection fails
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));




const chatUser = new mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

const userModel = mongoose.model('userModel', chatUser);

module.exports = {
  mongoose,
  userModel
};
