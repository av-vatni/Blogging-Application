const { Router } = require("express");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isAuthenticated } = require("../middlewares/authentication");

const router = Router();

// Input validation helper
const validateInput = (data) => {
    const errors = [];
    
    if (!data.fullname || data.fullname.trim().length < 2) {
        errors.push("Full name must be at least 2 characters long");
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push("Please provide a valid email address");
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }
    
    return errors;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/images/profiles');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Route to render the sign-in page
router.get("/signin", (req, res) => {
    return res.render("signin");
});

// Route to render the sign-up page
router.get("/signup", (req, res) => {
    return res.render("signup");
});

// Route to handle user sign-in
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.render("signin", {
                error: "Email and password are required"
            });
        }
        
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.error('Signin error:', error.message);
        return res.render("signin", {
            error: "Incorrect Email or Password"
        });
    }
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/");
});

// Route to handle user sign-up
router.post("/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        
        // Validate input
        const validationErrors = validateInput({ fullname, email, password });
        if (validationErrors.length > 0) {
            return res.render("signup", {
                error: validationErrors.join(", ")
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.render("signup", {
                error: "User with this email already exists"
            });
        }
        
        // Create new user
        await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password,
        });
        
        return res.redirect("/user/signin");
    } catch (error) {
        console.error('Signup error:', error.message);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.render("signup", {
                error: "User with this email already exists"
            });
        }
        
        return res.render("signup", {
            error: "Error creating user. Please try again."
        });
    }
});

// Route to render profile page
router.get("/profile", isAuthenticated, (req, res) => {
    return res.render("profile", { user: req.user });
});

// Route to update profile
router.post("/profile", isAuthenticated, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/user/signin");
        }

        const { fullname, email } = req.body;
        const updateData = {};

        // Validate fullname
        if (fullname && fullname.trim().length >= 2) {
            updateData.fullname = fullname.trim();
        }

        // Validate email
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ 
                email: email.toLowerCase().trim(),
                _id: { $ne: req.user._id }
            });
            if (existingUser) {
                return res.render("profile", {
                    user: req.user,
                    error: "Email is already taken by another user"
                });
            }
            updateData.email = email.toLowerCase().trim();
        }

        // Handle profile image upload
        if (req.file) {
            // Delete old profile image if it exists and is not the default
            if (req.user.profileImageURL && 
                req.user.profileImageURL !== '/images/default.png' &&
                req.user.profileImageURL.startsWith('/images/profiles/')) {
                const publicDir = path.join(__dirname, '../public');
                const relativePath = req.user.profileImageURL.replace(/^\//, '');
                const oldImagePath = path.join(publicDir, relativePath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            updateData.profileImageURL = `/images/profiles/${req.file.filename}`;
        }

        // Update user profile
        if (Object.keys(updateData).length > 0) {
            await User.findByIdAndUpdate(req.user._id, updateData);
            // Update req.user for the current session
            Object.assign(req.user, updateData);
        }

        res.render("profile", { 
            user: req.user,
            success: "Profile updated successfully!"
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.render("profile", {
            user: req.user,
            error: "Failed to update profile. Please try again."
        });
    }
});

module.exports = router;