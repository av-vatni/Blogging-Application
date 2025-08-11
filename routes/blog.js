const { Router } = require("express");
const Blog = require("../models/blog");
const { isAuthenticated } = require("../middlewares/authentication");

const router = Router();

// Get all blogs with pagination and search
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { body: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const blogs = await Blog.find(query)
            .populate("createdBy", "fullname profileImageURL")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.render('blogs', {
            user: req.user,
            blogs,
            currentPage: page,
            totalPages,
            total,
            search,
            limit
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).render('error', {
            user: req.user,
            error: 'Failed to load blogs'
        });
    }
});

// Render add blog form
router.get('/add-new', isAuthenticated, (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("createdBy", "fullname profileImageURL");
        
        if (!blog) {
            return res.status(404).render('error', {
                user: req.user,
                error: 'Blog not found'
            });
        }

        res.render('blogDetail', {
            user: req.user,
            blog
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).render('error', {
            user: req.user,
            error: 'Failed to load blog'
        });
    }
});

// Create new blog
router.post('/add-new', isAuthenticated, async (req, res) => {
    try {
        const { title, body, coverImage } = req.body;
        
        // Basic validation
        if (!title || !body) {
            return res.render('addBlog', {
                user: req.user,
                error: 'Title and body are required',
                formData: { title, body, coverImage }
            });
        }

        const blog = await Blog.create({
            title: title.trim(),
            body: body.trim(),
            coverImage: coverImage || '',
            createdBy: req.user._id
        });

        res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.render('addBlog', {
            user: req.user,
            error: 'Failed to create blog. Please try again.',
            formData: req.body
        });
    }
});

// Render edit blog form
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).render('error', {
                user: req.user,
                error: 'Blog not found'
            });
        }

        // Check if user owns the blog
        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', {
                user: req.user,
                error: 'You can only edit your own blogs'
            });
        }

        res.render('editBlog', {
            user: req.user,
            blog
        });
    } catch (error) {
        console.error('Error fetching blog for edit:', error);
        res.status(500).render('error', {
            user: req.user,
            error: 'Failed to load blog for editing'
        });
    }
});

// Update blog
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, body, coverImage } = req.body;
        
        // Basic validation
        if (!title || !body) {
            return res.render('editBlog', {
                user: req.user,
                error: 'Title and body are required',
                blog: { ...req.body, _id: req.params.id }
            });
        }

        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).render('error', {
                user: req.user,
                error: 'Blog not found'
            });
        }

        // Check if user owns the blog
        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', {
                user: req.user,
                error: 'You can only edit your own blogs'
            });
        }

        await Blog.findByIdAndUpdate(req.params.id, {
            title: title.trim(),
            body: body.trim(),
            coverImage: coverImage || ''
        });

        res.redirect(`/blog/${req.params.id}`);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.render('editBlog', {
            user: req.user,
            error: 'Failed to update blog. Please try again.',
            blog: { ...req.body, _id: req.params.id }
        });
    }
});

// Delete blog
router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).render('error', {
                user: req.user,
                error: 'Blog not found'
            });
        }

        // Check if user owns the blog
        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', {
                user: req.user,
                error: 'You can only delete your own blogs'
            });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).render('error', {
            user: req.user,
            error: 'Failed to delete blog'
        });
    }
});

module.exports = router;