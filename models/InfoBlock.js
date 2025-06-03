const mongoose = require('mongoose');

const infoBlockSchema = new mongoose.Schema({
  titel: { type: String, required: true },
  tekst: { type: String, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('InfoBlock', infoBlockSchema);
