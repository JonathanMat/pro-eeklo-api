const jwt = require('jsonwebtoken');
const geheimeSleutel = 'geheime-jwt-sleutel';

function verifyToken(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "Geen token" });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, geheimeSleutel, (err, user) => {
      if (err) return res.status(403).json({ error: "Ongeldige token" });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: "Geen toegang" });
      }

      req.user = user;
      next();
    });
  };
}

module.exports = { verifyToken, geheimeSleutel };
