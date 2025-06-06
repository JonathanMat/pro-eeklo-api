const express = require('express');
const router = express.Router();
const Deelname = require('../models/Deelname');
const { verifyToken } = require('../authMiddleware');

// GET - openbaar
router.get('/', async (req, res) => {
  const block = await Deelname.findOne();
  if (!block) return res.status(404).json({ error: 'Niet gevonden' });
  res.json(block);
});

// POST - enkel 1 keer door admin/beheer
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const bestaat = await Deelname.findOne();
  if (bestaat) return res.status(400).json({ error: 'Bestaat al, gebruik PUT om te wijzigen.' });

  const { inhoud } = req.body;
  if (!inhoud) return res.status(400).json({ error: 'Inhoud is verplicht' });

  const nieuw = new Deelname({ inhoud });
  await nieuw.save();
  res.status(201).json(nieuw);
});

// PUT - aanpassen
router.put('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const block = await Deelname.findOne();
  if (!block) return res.status(404).json({ error: 'Niet gevonden' });

  const { inhoud } = req.body;
  if (!inhoud) return res.status(400).json({ error: 'Inhoud is verplicht' });

  block.inhoud = inhoud;
  await block.save();
  res.json({ message: 'Bijgewerkt', block });
});

module.exports = router;
