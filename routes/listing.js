const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listing");

const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn, // Create Route
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createLisitng)
    );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))  // Show Route (Read)
    .put(                                                   // Update Route
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(                                              // Delete Route
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

router;

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
