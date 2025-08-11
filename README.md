# Blogify - A Modern Blogging Application

A full-featured blogging platform built with Node.js, Express, MongoDB, and EJS templating engine.

## 🚀 Features

### Core Blogging Features
- **Create, Read, Update, Delete (CRUD)** blog posts
- **User Authentication** with JWT tokens
- **User Registration & Login** with secure password hashing
- **User Profile**: view/update name and email
- **Avatar Upload**: upload/change profile photo (PNG/JPG/GIF up to 5MB)
- **Blog Search** functionality
- **Pagination** for better performance
- **Responsive Design** with Bootstrap 5

### Security Features
- **JWT Authentication** with secure cookie storage
- **Password Hashing** using SHA-256 with salt
- **Input Validation** and sanitization
- **CSRF Protection** through proper form handling
- **User Authorization** (users can only edit/delete their own blogs)

### User Experience
- **Modern UI** with Bootstrap components
- **Responsive Navigation** with user profile dropdown
- **Fixed dropdown layering** so Profile/Logout remain clickable on every page
- **Error Handling** with user-friendly messages
- **Form Validation** with helpful feedback
- **Image Support** for blog cover images and user avatars

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating engine, Bootstrap 5.3.3
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Bootstrap CSS framework with custom styles
- **Icons**: Bootstrap Icons

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 4. Configuration (Optional)
Copy the configuration example and customize:
```bash
cp config.example.js config.js
# Edit config.js with your preferred settings
```

### 5. Start the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
node index.js
```

The application will be available at `http://localhost:8000`

## 📁 Project Structure

```
blogging-application/
├── config.example.js      # Configuration template
├── index.js              # Main application entry point
├── package.json          # Dependencies and scripts
├── middlewares/          # Custom middleware functions
│   └── authentication.js # JWT authentication middleware (cookie → req.user, guards)
├── models/               # Database models
│   ├── blog.js          # Blog post model
│   └── user.js          # User model
├── routes/               # Route handlers
│   ├── blog.js          # Blog-related routes
│   └── user.js          # User authentication routes
├── services/             # Business logic services
│   └── authentication.js # JWT token management
├── views/                # EJS template files
│   ├── partials/        # Reusable template components
│   ├── addBlog.ejs      # Create blog form
│   ├── blogDetail.ejs   # Individual blog view
│   ├── editBlog.ejs     # Edit blog form
│   ├── error.ejs        # Error page
│   ├── home.ejs         # Homepage with blog listing
│   ├── profile.ejs      # User profile page (update name/email/avatar)
│   ├── signin.ejs       # User sign-in form
│   └── signup.ejs       # User registration form
└── public/               # Static assets
    └── images/           # Default images
        └── profiles/     # Uploaded user avatars (auto-created)
```

## 🔐 API Endpoints

### Authentication Routes
- `GET /user/signin` - Sign-in page
- `POST /user/signin` - User authentication
- `GET /user/signup` - Registration page
- `POST /user/signup` - User registration
- `GET /user/logout` - User logout

### Profile Routes
- `GET /user/profile` - View profile (authenticated)
- `POST /user/profile` - Update profile (authenticated)
  - Form fields:
    - `fullname` (required, min 2 chars)
    - `email` (required, unique, valid)
    - `profileImage` (optional file input; PNG/JPG/GIF ≤ 5MB)

### Blog Routes
- `GET /` - Homepage with blog listing
- `GET /blog` - All blogs with pagination and search
- `GET /blog/:id` - Individual blog view
- `GET /blog/add-new` - Create blog form (authenticated)
- `POST /blog/add-new` - Create new blog (authenticated)
- `GET /blog/edit/:id` - Edit blog form (authenticated, owner only)
- `POST /blog/edit/:id` - Update blog (authenticated, owner only)
- `POST /blog/delete/:id` - Delete blog (authenticated, owner only)

## 🎨 Customization

### Styling
- Modify `views/partials/head.ejs` for custom CSS
- Update Bootstrap theme variables
- Add custom JavaScript in `views/partials/scripts.ejs`

### Database Models
- Extend user model in `models/user.js`
- Add new fields to blog model in `models/blog.js`
- Create new models as needed

### Routes
- Add new routes in existing route files
- Create new route files for additional features
- Implement middleware for route protection

### Authentication middleware used
- `checkForAuthenticationCookie('token')` populates `req.user` and `res.locals.user` when a valid JWT cookie is present. Configured in `index.js`.
- `isAuthenticated` guard denies access and redirects to `/user/signin` if not logged in.

## 🔒 Security Considerations

- **JWT Secret**: Change the default JWT secret in production
- **Environment Variables**: Use `.env` files for sensitive configuration
- **Input Validation**: All user inputs are validated and sanitized
- **Password Security**: Passwords are hashed with salt using SHA-256
- **Authentication**: Protected routes require valid JWT tokens
 - **File Uploads**: Avatar uploads are handled with Multer, validated by mime/extension, size-limited to 5MB, and stored under `public/images/profiles`. When updating the avatar, previous user-uploaded image is removed.

## 🚀 Deployment

### Environment Variables
Set these environment variables in production:
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-jwt-secret
COOKIE_SECRET=your-super-secure-cookie-secret
```

### Production Considerations
- Use HTTPS in production
- Set secure cookie flags
- Implement rate limiting
- Add logging and monitoring
- Use PM2 or similar process manager

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in configuration
   - Verify database permissions

2. **JWT Authentication Issues**
   - Clear browser cookies
   - Check JWT secret consistency
   - Verify token expiration

3. **Port Already in Use**
   - Change port in configuration
   - Kill existing process using the port
   - Use different port number

4. **Profile/Logout not clickable in dropdown**
   - Ensure the global styles from `views/partials/head.ejs` are loaded. The navbar and dropdown use elevated `z-index` so they appear above content. If you copied templates without the head partial, add:
     ```css
     .navbar { position: relative; z-index: 2000; }
     .dropdown-menu { z-index: 2100; }
     ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Bootstrap team for the excellent CSS framework
- MongoDB team for the robust database
- Express.js community for the web framework
- JWT.io for the authentication standard

---

**Happy Blogging! 🚀**
