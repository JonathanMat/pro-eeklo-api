const express = require('express');
const router = express.Router();
const Realiseren = require('../models/Realiseren');
const { verifyToken } = require('../authMiddleware');

// GET – publiek, altijd het enige block
router.get('/', async (req, res) => {
  const block = await Realiseren.findOne();
  res.json(block);
});

// POST – admin/beheer, maak aan of update het enige block
router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { titel, tekst } = req.body;

  if (!titel || !tekst) {
    return res.status(400).json({ error: 'titel en tekst zijn verplicht' });
  }

  let block = await Realiseren.findOne();
  if (block) {
    block.titel = titel;
    block.tekst = tekst;
    await block.save();
    return res.status(200).json({ message: 'Block bijgewerkt', data: block });
  } else {
    block = new Realiseren({ titel, tekst });
    await block.save();
    return res.status(201).json({ message: 'Block aangemaakt', data: block });
  }
});

// PUT – wijzig het enige block
router.put('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { titel, tekst } = req.body;

  let block = await Realiseren.findOne();
  if (!block) return res.status(404).json({ error: 'Niet gevonden' });

  if (titel) block.titel = titel;
  if (tekst) block.tekst = tekst;
  await block.save();

  res.json({ message: 'Block bijgewerkt', data: block });
});

module.exports = router;