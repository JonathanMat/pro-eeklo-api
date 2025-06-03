const mongoose = require('mongoose');

const realiserenSchema = new mongoose.Schema({
  titel: { type: String, required: true },
  tekst: { type: String, required: true }
});

module.exports = mongoose.model('Realiseren', realiserenSchema);
