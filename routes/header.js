const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../authMiddleware');
const Header = require('../models/Header');

// Uploadconfig
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Serve static images
router.use('/uploads', express.static('uploads'));

// GET - haal header op uit DB
router.get('/', async (req, res) => {
  const header = await Header.findOne();
  if (!header) return res.status(404).json({ error: 'Nog geen header aangemaakt' });
  res.json(header);
});

// POST - maak nieuwe header aan (alleen admin/beheer)
router.post('/', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  const bestaand = await Header.findOne();
  if (bestaand) return res.status(400).json({ error: 'Header bestaat al. Gebruik PUT om te wijzigen.' });

  const { titel, tekst } = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  if (!titel || !tekst || !imagePath) {
    return res.status(400).json({ error: 'titel, tekst en image zijn verplicht' });
  }

  const nieuwHeader = new Header({ titel, tekst, image: imagePath });
  await nieuwHeader.save();
  res.status(201).json({ message: 'Header aangemaakt', header: nieuwHeader });
});

// PUT - werk bestaande header bij (alleen admin/beheer)
router.put('/', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  const header = await Header.findOne();
  if (!header) return res.status(404).json({ error: 'Geen bestaande header om te wijzigen' });

  const { titel, tekst } = req.body;

  if (!titel && !tekst && !req.file) {
    return res.status(400).json({ error: 'Minstens één veld moet worden meegegeven' });
  }

  if (titel) header.titel = titel;
  if (tekst) header.tekst = tekst;
  if (req.file) header.image = `uploads/${req.file.filename}`;

  await header.save();
  res.json({ message: 'Header bijgewerkt', header });
});

module.exports = router;
