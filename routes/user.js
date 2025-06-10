const { Router } = require("express");
const User = require("../models/user");

const router = Router();

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
    const { email, password } = req.body;

    try {
        // Validate user credentials and generate a token
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // Set token in cookies and redirect to the home page
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        // Render the sign-in page with an error message if authentication fails
        return res.render("signin", {
            error: "Incorrect email or password",
        });
    }
});

router.get('/logout', (req, res)=>{
    res.clearCookie("token").redirect("/")
})

// Route to handle user sign-up
router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        await User.create({
            fullname,
            email,
            password,
        });

        return res.redirect("/");
    } catch (error) {
        // Render the sign-up page with an error message if creation fails
        return res.render("signup", {
            error: error.message || "Error creating user",
        });
    }
});


module.exports = router;