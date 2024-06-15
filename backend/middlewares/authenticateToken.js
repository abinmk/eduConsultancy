// In middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);

    try {
      const foundUser = await User.findOne({ mobileNumber: user.mobileNumber });
      if (!foundUser) return res.sendStatus(404);
      req.user = foundUser;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
    }
  });
};

module.exports = authenticateToken;
