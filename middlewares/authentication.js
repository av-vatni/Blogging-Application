const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Use the same secret as in services/authentication.js
const JWT_SECRET = process.env.JWT_SECRET;

function checkForAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const token = req.cookies[cookieName];
        if (!token) {
            req.user = null;
            res.locals.user = null;
            return next();
        }
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(payload._id);
            if (!user) {
                throw new Error('User not found');
            }
            req.user = user;
            res.locals.user = user;
        } catch (error) {
            console.error('JWT verification error:', error.message);
            req.user = null;
            res.locals.user = null;
            // Clear invalid token
            res.clearCookie(cookieName);
        }
        next();
    };
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    next();
}

module.exports = { checkForAuthenticationCookie, isAuthenticated };