const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  titel: { type: String, required: true },
  tekst: { type: String, required: true }
});

module.exports = mongoose.model('Logo', logoSchema);
