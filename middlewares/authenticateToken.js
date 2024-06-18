const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = { id: decoded.userId, username: decoded.username }; // Store user information in request object
    next(); // Pass the execution to the next middleware or the final handler
  });
};

module.exports = authenticateToken;