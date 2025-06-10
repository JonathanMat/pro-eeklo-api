const mongoose = require('mongoose');

const teamlidSchema = new mongoose.Schema({
  nummer: { type: Number, required: true, unique: true },
  naam: { type: String, required: true },
  leeftijd: { type: Number }, // bv. "55 jaar"
  functie: { type: String }, // bv. "huisarts en gewezen provincieraadslid"
  inhoud: { type: String }, // detailpagina info (mag met <br>, markdown, etc.)
  image: { type: String }, // pad naar de afbeelding (uploads/...)
});

module.exports = mongoose.model('Teamlid', teamlidSchema);
