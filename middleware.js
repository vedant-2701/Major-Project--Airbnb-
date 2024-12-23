const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema } = require("./utils/schema");
const { reviewSchema } = require("./utils/schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {

        // Redirect URL (When user is not logged in we need to store the url so that after user logs in he would be redirected 
        // to the url he wants to access and not on home page)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create new listing");
        return res.redirect("/login");
    }

    next();
};

// For saving url in session
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    // Find the user and check whether the owner is same who is upadting the listing or not
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized to update this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    // Find the user and check whether the author is same who is upadting the listing or not
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized to update this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// Validate Listing -> Middleware
module.exports.validateListing = (req, res, next) => {
    // extract error
    let { error } = listingSchema.validate(req.body);

    // if error is present -> display error or call next middleware
    if(error) {

        let errorMsg = error.details.map(el => el.message).join(", ");

        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

// Validate Review -> Middleware
module.exports.validateReview = (req, res, next) => {
    // extract error
    let { error } = reviewSchema.validate(req.body);

    // if error is present -> display error or call next middleware
    if(error) {

        let errorMsg = error.details.map(el => el.message).join(", ");

        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};
