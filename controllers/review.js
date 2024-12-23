const Listing = require("../models/listing");
const Review = require("../models/review");

// Create Review
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    // Store the author of the review
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review created");

    res.redirect(`/listings/${listing._id}`);
};

// Destroy Review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // delete from listings model rather update listing model
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // delete from review model
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");

    res.redirect(`/listings/${id}`);
};