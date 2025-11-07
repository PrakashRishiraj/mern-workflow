import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1]; //extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

//Middleware for role-based access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

const projectLeaderOnly = (req, res, next) => {
    if (req.user && req.user.role === 'project-leader') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Project Leaders only' });
    }
};

export { protect, adminOnly, projectLeaderOnly };