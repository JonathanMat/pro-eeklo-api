const express = require('express');
const router = express.Router();
const Logo = require('../models/Logo');
const { verifyToken } = require('../authMiddleware');

// GET - publiek
router.get('/', async (req, res) => {
  const logo = await Logo.findOne();
  if (!logo) return res.status(404).json({ error: 'Logo niet gevonden' });
  res.json(logo);
});

// POST - alleen admin/beheer, maar alleen als er nog geen bestaat
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const bestaat = await Logo.findOne();
  if (bestaat) return res.status(400).json({ error: 'Logo bestaat al. Gebruik PUT om te wijzigen.' });

  const { titel, tekst } = req.body;
  if (!titel || !tekst) return res.status(400).json({ error: 'Titel en tekst zijn verplicht' });

  const nieuw = new Logo({ titel, tekst });
  await nieuw.save();
  res.status(201).json({ message: 'Logo aangemaakt', logo: nieuw });
});

// PUT - alleen admin/beheer
router.put('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { titel, tekst } = req.body;

  const logo = await Logo.findOne();
  if (!logo) return res.status(404).json({ error: 'Logo niet gevonden' });

  if (titel) logo.titel = titel;
  if (tekst) logo.tekst = tekst;

  await logo.save();
  res.json({ message: 'Logo bijgewerkt', logo });
});

module.exports = router;
