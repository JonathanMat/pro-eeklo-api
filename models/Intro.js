const mongoose = require('mongoose');

const introSchema = new mongoose.Schema({
  titel: { type: String, required: true },
  tekst: { type: String, required: true }
});

module.exports = mongoose.model('Intro', introSchema);
