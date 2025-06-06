const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  naam: { type: String, required: true },
  beschrijving: { type: String },
});

module.exports = mongoose.model('Categorie', categorieSchema);