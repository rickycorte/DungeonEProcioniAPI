'use strict';

const mongoose = require('mongoose');  

var CharacterSchema = new mongoose.Schema({ 

  ownerid: String,

  name: String,
  data: { type: Object, default: {}}
 
}, {collection: "Characters"});

mongoose.model('Character', CharacterSchema);

module.exports = mongoose.model('Character');