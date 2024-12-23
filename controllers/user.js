const User = require("../models/user");

// Render sign up form
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};

// Sign Up
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password} = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Login
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    // req.session.redirectUrl -> passport resets the session object after user logs in so we need to save that in locals
};

// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!!");
        res.redirect("/listings");
    });
};

