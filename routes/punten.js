const express = require('express');
const router = express.Router();
const Punt = require('../models/Punt');
const { verifyToken } = require('../authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const punten = await Punt.find().populate('categorie');
  res.json(punten);
});

router.post('/', verifyToken(['admin', 'beheer']), upload.fields([{ name: 'afbeelding1' }, { name: 'afbeelding2' }]), async (req, res) => {
  const { categorie, titel, inhoud } = req.body;
  const afbeelding1 = req.files['afbeelding1']?.[0]?.path;
  const afbeelding2 = req.files['afbeelding2']?.[0]?.path;

  const punt = new Punt({ categorie, titel, inhoud, afbeelding1, afbeelding2 });
  await punt.save();
  res.status(201).json(punt);
});

router.get('/:id', async (req, res) => {
  try {
    const punt = await Punt.findById(req.params.id).populate('categorie');
    if (!punt) {
      return res.status(404).json({ error: 'Punt niet gevonden' });
    }
    res.json(punt);
  } catch (err) {
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

router.put('/:id', verifyToken(['admin', 'beheer']), upload.fields([{ name: 'afbeelding1' }, { name: 'afbeelding2' }]), async (req, res) => {
  const { categorie, titel, inhoud } = req.body;
  const update = { categorie, titel, inhoud };

  if (req.files['afbeelding1']) {
    update.afbeelding1 = `uploads/${req.files['afbeelding1'][0].filename}`;
  }
  if (req.files['afbeelding2']) {
    update.afbeelding2 = `uploads/${req.files['afbeelding2'][0].filename}`;
  }

  try {
    const punt = await Punt.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!punt) return res.status(404).json({ error: 'Punt niet gevonden' });
    res.json(punt);
  } catch (err) {
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

router.delete('/:id', verifyToken(['admin', 'beheer']), async (req, res) => {
  try {
    const punt = await Punt.findById(req.params.id);
    if (!punt) return res.status(404).json({ error: 'Punt niet gevonden' });

    // Verwijder afbeeldingen van de schijf indien ze bestaan
    [punt.afbeelding1, punt.afbeelding2].forEach((bestand) => {
      if (bestand) {
        const filePath = path.join(__dirname, '..', bestand);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    // Verwijder uit de database
    await Punt.findByIdAndDelete(req.params.id);

    res.json({ message: 'Punt en afbeeldingen succesvol verwijderd' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

module.exports = router;
