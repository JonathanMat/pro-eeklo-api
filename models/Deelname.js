const mongoose = require('mongoose');

const deelnameSchema = new mongoose.Schema({
  inhoud: { type: String, required: true } // HTML-string
});

module.exports = mongoose.model('Deelname', deelnameSchema);
