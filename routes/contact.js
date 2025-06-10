const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.SMTP_USER, // waar jij de mail ontvangt
      subject: 'Nieuw bericht van formulier',
      text: `Naam: ${name}\nEmail: ${email}\nBericht:\n${message}`,
    });

    res.status(200).json({ success: true, message: 'E-mail verzonden!' });
  } catch (err) {
    console.error('E-mail verzenden mislukt:', err);
    res.status(500).json({ success: false, message: 'E-mail verzenden mislukt.' });
  }
});

module.exports = router;
