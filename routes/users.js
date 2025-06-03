const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { verifyToken } = require('../authMiddleware');

const router = express.Router();

router.get('/', verifyToken(['beheer']), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

router.post('/', verifyToken(['beheer']), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: 'Verplichte velden ontbreken' });

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, passwordHash, role });
    await user.save();
    res.status(201).json({ message: 'Gebruiker aangemaakt' });
  } catch (err) {
    res.status(400).json({ error: 'Gebruiker bestaat al' });
  }
});

router.delete('/:username', verifyToken(['beheer']), async (req, res) => {
  const result = await User.findOneAndDelete({ username: req.params.username });
  if (!result) return res.status(404).json({ error: 'Niet gevonden' });
  res.json({ message: 'Gebruiker verwijderd' });
});

module.exports = router;
