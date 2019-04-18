'use strict';

const mongoose = require('mongoose');  

var CharacterSchema = new mongoose.Schema({ 

  ownerid: String,

  name: String,
  class: { type: String, default : "" },
  race: { type: String, default : "" },
  level: { type: Number, default : 0 },
  experience: { type: Number, default: 0 },
  background: { type: String, default: "" },
  alignment: { type: String, default: "" },
  health: { type: Object, default: {} },
  skills: { type: Object, default: {} },
  inventory: { type: Object, default: {} },
  spells : { type: Object, default: {} },
  details: { type: Object, default: {}}
 
}, {collection: "Characters"});

mongoose.model('Character', CharacterSchema);

module.exports = mongoose.model('Character');