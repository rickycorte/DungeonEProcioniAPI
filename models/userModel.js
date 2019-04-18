'use strict';

const mongoose = require('mongoose');  

var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
}, {collection: "Users"});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');