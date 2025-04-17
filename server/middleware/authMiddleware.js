const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Authentication required',
      details: 'No valid authentication found. Please login or provide a valid token.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        message: 'Invalid token',
        details: 'The provided token is invalid or expired.'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;