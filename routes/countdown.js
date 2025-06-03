const express = require('express');
const router = express.Router();
const Countdown = require('../models/Countdown');
const { verifyToken } = require('../authMiddleware');

// GET - Openbaar
router.get('/', async (req, res) => {
  const countdown = await Countdown.findOne();
  if (!countdown) return res.status(404).json({ error: 'Geen einddatum ingesteld' });

  const date = countdown.endDate;

  res.json({
    endDate: date,
    jaar: date.getFullYear(),
    maand: date.getMonth(),        // let op: 0 = januari
    dag: date.getDate(),
    uur: date.getHours(),
    minuut: date.getMinutes()
  });
});

// POST - Alleen admin of beheer mag instellen
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { jaar, maand, dag, uur, minuut } = req.body;

  if (
    typeof jaar !== 'number' ||
    typeof maand !== 'number' ||
    typeof dag !== 'number' ||
    typeof uur !== 'number' ||
    typeof minuut !== 'number'
  ) {
    return res.status(400).json({ error: 'Alle velden (jaar, maand, dag, uur, minuut) zijn verplicht en numeriek' });
  }

  const endDate = new Date(jaar, maand, dag, uur, minuut);

  let countdown = await Countdown.findOne();
  if (countdown) {
    countdown.endDate = endDate;
    await countdown.save();
    res.json({ message: 'Einddatum bijgewerkt', endDate });
  } else {
    countdown = new Countdown({ endDate });
    await countdown.save();
    res.status(201).json({ message: 'Einddatum ingesteld', endDate });
  }
});

module.exports = router;
