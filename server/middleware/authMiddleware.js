import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import fs from 'fs';
import path from 'path';

export const protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];

            // Log token (masked)
            const logPath = path.join(process.cwd(), 'auth_debug.log');
            fs.appendFileSync(logPath, `${new Date().toISOString()} - Token received: ${token.substring(0, 10)}...\n`);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            fs.appendFileSync(logPath, `${new Date().toISOString()} - Decoded ID: ${decoded.id}\n`);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                fs.appendFileSync(logPath, `${new Date().toISOString()} - User not found for ID: ${decoded.id}\n`);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            fs.appendFileSync(logPath, `${new Date().toISOString()} - User authenticated: ${req.user._id}\n`);
            next();
        } else {
            const logPath = path.join(process.cwd(), 'auth_debug.log');
            fs.appendFileSync(logPath, `${new Date().toISOString()} - No token provided\n`);
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error(error);
        const logPath = path.join(process.cwd(), 'auth_debug.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - Auth Error: ${error.message}\nStack: ${error.stack}\n`);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
