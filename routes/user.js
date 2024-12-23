const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

router
    .route("/signup")
    .get(userController.renderSignUpForm)       // Render signup form
    .post(wrapAsync(userController.signup));    //signup

// Login
router
    .route("/login")
    .get(userController.renderLoginForm)        // Render login form
    .post(                                      // login
        saveRedirectUrl,    
        passport.authenticate("local", {
            /* Middleware */ /* Authenticates automatically */
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;
