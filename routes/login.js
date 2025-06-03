const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { geheimeSleutel } = require('../authMiddleware');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, geheimeSleutel, {
    expiresIn: '1h',
  });

  res.json({ token });
});

module.exports = router;
