const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Check if user is admin in JWT
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Double-check admin status in database
    const user = await User.findById(req.user.id).select('isAdmin');
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access revoked' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};