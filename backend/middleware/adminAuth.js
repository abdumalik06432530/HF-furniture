import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Allow access for admin or superadmin roles.
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Attach decoded token to both req.admin and req.user for compatibility
    req.admin = decoded;
    req.user = decoded;
    next();
  } catch (error) {
    // If token expired, return a clear message so frontend can act (e.g., prompt re-login)
    if (error && error.name === 'TokenExpiredError') {
      console.error('adminAuth token expired:', error.message || error);
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    console.error('adminAuth error:', error.message || error);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

export default adminAuth;
