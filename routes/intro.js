const express = require('express');
const router = express.Router();
const Intro = require('../models/Intro');
const { verifyToken } = require('../authMiddleware');

// GET - openbaar
router.get('/', async (req, res) => {
  const intro = await Intro.findOne();
  if (!intro) return res.status(404).json({ error: 'Intro niet gevonden' });
  res.json(intro);
});

// POST - alleen beheer/admin
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const bestaand = await Intro.findOne();
  if (bestaand) return res.status(400).json({ error: 'Intro bestaat al. Gebruik PUT om te wijzigen.' });

  const { titel, tekst } = req.body;
  if (!titel || !tekst) return res.status(400).json({ error: 'titel en tekst zijn verplicht' });

  const nieuwIntro = new Intro({ titel, tekst });
  await nieuwIntro.save();

  res.status(201).json({ message: 'Intro aangemaakt', intro: nieuwIntro });
});

// PUT - wijzigen (alleen beheer/admin)
router.put('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const intro = await Intro.findOne();
  if (!intro) return res.status(404).json({ error: 'Intro niet gevonden' });

  const { titel, tekst } = req.body;
  if (!titel && !tekst) return res.status(400).json({ error: 'titel of tekst is vereist' });

  if (titel) intro.titel = titel;
  if (tekst) intro.tekst = tekst;

  await intro.save();
  res.json({ message: 'Intro bijgewerkt', intro });
});

module.exports = router;
