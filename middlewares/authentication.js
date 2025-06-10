const jwt = require("jsonwebtoken");
const User = require("../models/user");

function checkForAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const token = req.cookies[cookieName];
        if (!token) {
            req.user = null;
            res.locals.user = null;
            return next();
        }
        try {
            const payload = jwt.verify(token, "secret"); // Use your JWT secret
            const user = await User.findById(payload._id);
            req.user = user;
            res.locals.user = user; // <-- This line is important!
        } catch (e) {
            req.user = null;
            res.locals.user = null;
        }
        next();
    };
}

module.exports = { checkForAuthenticationCookie };