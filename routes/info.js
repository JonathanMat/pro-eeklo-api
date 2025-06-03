const express = require('express');
const router = express.Router();
const InfoBlock = require('../models/InfoBlock');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../authMiddleware');

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// GET all blocks
router.get('/', async (req, res) => {
  const blocks = await InfoBlock.find();
  res.json(blocks);
});

// POST nieuw block (admin/beheer)
router.post('/', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  const { titel, tekst } = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  if (!titel || !tekst || !imagePath) {
    return res.status(400).json({ error: 'titel, tekst en image zijn verplicht' });
  }

  const newBlock = new InfoBlock({ titel, tekst, image: imagePath });
  await newBlock.save();
  res.status(201).json(newBlock);
});

// PUT wijzig block
router.put('/:id', verifyToken(['admin', 'beheer']), upload.single('image'), async (req, res) => {
  const { titel, tekst } = req.body;
  const update = {};

  if (titel) update.titel = titel;
  if (tekst) update.tekst = tekst;
  if (req.file) update.image = `uploads/${req.file.filename}`;

  const updated = await InfoBlock.findByIdAndUpdate(req.params.id, update, { new: true });

  if (!updated) return res.status(404).json({ error: 'Block niet gevonden' });
  res.json(updated);
});

// DELETE block
router.delete('/:id', verifyToken(['admin', 'beheer']), async (req, res) => {
  const deleted = await InfoBlock.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Block niet gevonden' });
  res.json({ message: 'Verwijderd' });
});

module.exports = router;
