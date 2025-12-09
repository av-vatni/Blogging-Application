require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(express.json()); // Add JSON parsing for API endpoints
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Global middleware to make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", async (req, res) => {
    try {
        // Import Blog model here to avoid circular dependency
        const Blog = require('./models/blog');
        const blogs = await Blog.find({}).populate("createdBy", "fullname");
        
        res.render("home", {
            user: req.user,
            blogs: blogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.render("home", {
            user: req.user,
            blogs: [],
            error: "Failed to load blogs"
        });
    }
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        user: req.user,
        error: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        user: req.user,
        error: 'Page not found' 
    });
});

// app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}

module.exports = app;
