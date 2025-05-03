import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // First check for session authentication (Google OAuth)
  if (req.isAuthenticated()) {
    return next();
  }

  // Then check for JWT token (email/password login)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;  // Set the user object correctly
    next();
  } catch (error) {
    // return res.status(401).json({ error: 'Invalid token' });
    return res.status(400).json({ error: 'Invalid note ID' });
  }
};

export default authenticateToken;