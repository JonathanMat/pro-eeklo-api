const express = require('express');
const router = express.Router();
const Categorie = require('../models/Categorie');
const { verifyToken } = require('../authMiddleware');

router.get('/', async (req, res) => {
  const categorieen = await Categorie.find();
  res.json(categorieen);
});

router.post('/', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { naam, beschrijving } = req.body;
  const nieuw = new Categorie({ naam, beschrijving });
  await nieuw.save();
  res.status(201).json(nieuw);
});

router.put('/:id', verifyToken(['admin', 'beheer']), async (req, res) => {
  const { naam, beschrijving } = req.body;
  try {
    const updated = await Categorie.findByIdAndUpdate(
      req.params.id,
      { naam, beschrijving },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Categorie niet gevonden' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

module.exports = router;