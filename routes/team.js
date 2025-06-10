const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Teamlid = require('../models/Teamlid');
const { verifyToken } = require('../authMiddleware');
const mongoose = require('mongoose');

// upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

// GET alle teamleden
router.get('/', async (req, res) => {
  const teamleden = await Teamlid.find().sort({ nummer: 1 });
  res.json(teamleden);
});

// GET detail van een teamlid
router.get('/:id', async (req, res) => {
  const teamlid = await Teamlid.findById(req.params.id);
  if (!teamlid) return res.status(404).json({ error: 'Niet gevonden' });
  res.json(teamlid);
});

// POST nieuw teamlid (alleen admin/beheer)
router.post('/', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  const { nummer, naam, leeftijd, functie, inhoud } = req.body;
  const image = req.file ? `uploads/${req.file.filename}` : null;

  const bestaat = await Teamlid.findOne({ nummer });
  if (bestaat) {
    return res.status(400).json({ error: 'Nummer bestaat al' });
  }

  const nieuw = new Teamlid({ nummer, naam, leeftijd, functie, inhoud, image });
  await nieuw.save();
  res.status(201).json(nieuw);
});

// PUT update teamlid
router.put('/:id', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Ongeldig ID-formaat' });
  }

  const updates = req.body;
  let oudeImage = null;

  // Haal het bestaande teamlid op
  const bestaand = await Teamlid.findById(req.params.id);
  if (!bestaand) return res.status(404).json({ error: 'Niet gevonden' });

  // Als er een nieuwe afbeelding is, verwijder de oude
  if (req.file) {
    updates.image = `uploads/${req.file.filename}`;
    oudeImage = bestaand.image;
  }

  const bijgewerkt = await Teamlid.findByIdAndUpdate(req.params.id, updates, { new: true });

  // Verwijder oude afbeelding als die er was en vervangen is
  if (oudeImage && req.file) {
    fs.unlink(path.join(__dirname, '..', oudeImage), (err) => {
      if (err) console.error('Kon oude afbeelding niet verwijderen:', err);
    });
  }

  res.json(bijgewerkt);
});

// DELETE teamlid
router.delete('/:id', verifyToken(['admin', 'beheer']), async (req, res) => {
  const verwijderd = await Teamlid.findByIdAndDelete(req.params.id);
  if (!verwijderd) return res.status(404).json({ error: 'Niet gevonden' });

  // Verwijder de image als die bestaat
  if (verwijderd.image) {
    fs.unlink(path.join(__dirname, '..', verwijderd.image), (err) => {
      // Optioneel: log een fout, maar stuur altijd een response terug
      if (err) console.error('Kon afbeelding niet verwijderen:', err);
    });
  }

  res.json({ message: 'Teamlid verwijderd' });
});

module.exports = router;
