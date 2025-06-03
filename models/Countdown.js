const mongoose = require('mongoose');

const countdownSchema = new mongoose.Schema({
  endDate: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Countdown', countdownSchema);
