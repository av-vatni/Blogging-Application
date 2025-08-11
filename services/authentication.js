const JWT = require('jsonwebtoken'); // Import JSON Web Token library for token creation and verification

const secret = "@v@14321"; // Secret key used for signing and verifying tokens

// Function to create a JWT for a user
function createTokenForUser(user) {
    const payload = {
        _id: user._id, // User ID
        email: user.email, // User email
        profileImageURL: user.profileImageURL, // User profile image URL
        role: user.role, // User role
    };
    const token = JWT.sign(payload, secret); // Sign the payload with the secret key
    return token; // Return the generated token
}

// Function to validate and decode a JWT
function validateToken(token) {
    const payload = JWT.verify(token, secret); // Verify the token using the secret key
    return payload; // Return the decoded payload
}

// Export the functions for use in other parts of the application
module.exports = {
    createTokenForUser,
    validateToken,
};