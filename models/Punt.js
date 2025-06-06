const mongoose = require('mongoose');

const puntSchema = new mongoose.Schema({
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
  titel: { type: String, required: true },
  inhoud: { type: String },
  afbeelding1: { type: String },
  afbeelding2: { type: String },
});

module.exports = mongoose.model('Punt', puntSchema);