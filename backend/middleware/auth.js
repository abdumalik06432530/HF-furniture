import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        let token;

        // Prefer Authorization header: 'Bearer <token>' but also accept legacy 'token' header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.headers.token) {
            token = req.headers.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
        }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // If token is for the env-admin placeholder id, attach decoded and proceed
            if (decoded && decoded.id === 'env-admin') {
                req.user = decoded;
                return next();
            }

            // Otherwise, validate the user exists and is active
            if (!decoded || !decoded.id) {
                return res.status(401).json({ success: false, message: 'Token invalid' });
            }

            const user = await userModel.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            if (user.isActive === false) {
                return res.status(403).json({ success: false, message: 'Account disabled' });
            }

            // Attach user (and preserve role/id) for downstream handlers
            req.user = { id: user._id.toString(), role: user.role, user };
            next();
    } catch (error) {
            if (error && error.name === 'TokenExpiredError') {
                console.error('Auth middleware token expired:', error.message || error);
                return res.status(401).json({ success: false, message: 'Token expired' });
            }
            console.error('Auth middleware error:', error);
            return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

export default authUser;