const express = require('express');
const router = express.Router();
const Realiseren = require('../models/Realiseren');
const { verifyToken } = require('../authMiddleware');

// GET – publiek
router.get('/', async (req, res) => {
  const blocks = await Realiseren.find();
  res.json(blocks);
});

// POST – admin/beheer
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { titel, tekst } = req.body;

  if (!titel || !tekst) {
    return res.status(400).json({ error: 'titel en tekst zijn verplicht' });
  }

  const nieuw = new Realiseren({ titel, tekst });
  await nieuw.save();
  res.status(201).json({ message: 'Block aangemaakt', data: nieuw });
});

// PUT – wijzig via ID
router.put('/:id', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { id } = req.params;
  const { titel, tekst } = req.body;

  const block = await Realiseren.findById(id);
  if (!block) return res.status(404).json({ error: 'Niet gevonden' });

  if (titel) block.titel = titel;
  if (tekst) block.tekst = tekst;
  await block.save();

  res.json({ message: 'Block bijgewerkt', data: block });
});

module.exports = router;
