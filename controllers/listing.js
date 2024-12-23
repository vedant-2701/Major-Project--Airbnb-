const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index", { allListings });
};

// New
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);

    res.render("listings/new");
};

// Show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({                    // Populate reviews and author of the review (nested populate)
            path: "reviews", 
            populate: { 
                path: "author" 
            } 
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Requested Listing does not exists!!");
        res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

// Create
module.exports.createLisitng = async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Bad Request. Send valid data");
    // }

    // geocodingClient does forward geocoding to get the coordinates of the location
    let response = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`, // Passing the location, country from the form
        limit: 1        // Limit the number of results to 1 (By default it is set to 5)
    })
    .send();   
    
    // console.log(response);
    // console.log(response.body.features[0].geometry.coordinates);
    
    
    // Fetch url and filename from req.file to store it in the listing object
    let url = req.file.path;
    let filename = req.file.filename;
    
    let newListing = new Listing(req.body.listing);
    
    // Store the owner of the listing
    newListing.owner = req.user._id;

    // Store url and filename in the listing object
    newListing.image = { filename, url };

    // Store the coordinates in the listing object
    newListing.geometry = response.body.features[0].geometry;
    /* 
        {
            type: "Point",
            coordinates: [longitude, latitude]
        }
    */

    await newListing.save();

    req.flash("success", "New Listing created");

    res.redirect("/listings");
};

// Edit
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Requested Listing does not exists!!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; 

    originalImageUrl = originalImageUrl.replace("upload", "upload/w_250,h_300");

    res.render("listings/edit", { listing, originalImageUrl });
};

// Update
module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Bad Request. Send valid data");
    // }

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        // cloudinary.uploader.destroy(listing.image.filename); // Delete the previous image from cloudinary

        // Fetch url and filename from req.file to store it in the listing object
        let url = req.file.path;
        let filename = req.file.filename;
    
        // Store url and filename in the listing object
        listing.image = { filename, url };
    
        await listing.save();
    }

    req.flash("success", "Listing updated successfully");

    res.redirect(`/listings/${id}`);
};

// Destroy(used in industry) / Delete(normally used)
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully");

    console.log(deletedListing);

    res.redirect("/listings");
};
