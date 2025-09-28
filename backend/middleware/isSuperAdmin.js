// Middleware to ensure the authenticated user is a superadmin
const isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
    return next();
  } catch (err) {
    console.error('isSuperAdmin middleware error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default isSuperAdmin;