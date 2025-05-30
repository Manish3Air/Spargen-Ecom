const jwt = require('jsonwebtoken');

 const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

 const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Admin access only' });
}

  next();
};
module.exports = {
  protect,
  isAdmin,
};