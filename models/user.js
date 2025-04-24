// All we are doing here is creating a user model for the database

const {createHmac, randomBytes} = require('crypto');
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

// Importing the Schema object from mongoose

// Defining the schema for the User model
const userSchema = new Schema({
    // First name of the user, must be unique and is required
    fullname: {
        type: String,
        required: true,
        
    },
    // Email of the user, must be unique and is required
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Salt used for password hashing, required for security
    salt: {
        type: String,
    },
    // Hashed password of the user, required for authentication
    password: {
        type: String,
        required: true,
    },
    // URL of the user's profile image, defaults to a placeholder image
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    // Role of the user, can either be "USER" or "ADMIN", defaults to "USER"
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
// Automatically adds createdAt and updatedAt timestamps to the schema
{ timestamps: true }
);

// Middleware to handle password hashing before saving the user document
userSchema.pre("save", function (next) {
    const user = this;
    // If the password field is not modified, skip the hashing process
    if (!user.isModified("password")) return;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if(hashedPassword !== userProvidedHash)  throw new Error('Incorrect password');
    
    const token = createTokenForUser(user);
    return token;
})

// Creating the User model from the schema
const User = model("user", userSchema);

// Exporting the User model for use in other parts of the application
module.exports = User;
