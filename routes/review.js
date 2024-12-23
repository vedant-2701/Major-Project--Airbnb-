const express = require("express");
const router = express.Router({ mergeParams: true });
/* Preserve the req.params values from the parent router. In case of listings/:id/reviews, the id param is left in app.js and after 
that everything that comes in read by review.js. To avoid that we use (mergeParams: true) 
Due to this the parent route (in app.js) is merged with child route(in routes/___.js) ans we can access all the params from it.
*/
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/review");
// Reviews
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Deleting Reviews
router.delete(
    "/:reviewId",
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
