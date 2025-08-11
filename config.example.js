// Configuration file for Blogify application
// Copy this file to config.js and update the values

module.exports = {
    // Database Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blogsss'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 8000,
        env: process.env.NODE_ENV || 'development'
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || '@v@14321',
        expiresIn: '7d' // Token expires in 7 days
    },
    
    // Cookie Configuration
    cookie: {
        secret: process.env.COOKIE_SECRET || 'your-cookie-secret-here',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};
