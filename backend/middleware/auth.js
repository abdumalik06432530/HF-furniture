import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
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
            // Attach the decoded token to req.user for downstream middlewares
            req.user = decoded;
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