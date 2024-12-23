const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const link = "https://images.unsplash.com/photo-1720631442804-c6091ef9df97?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
  
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },

        url: {
            type: String,
            default: link,
            set: (v) => v === "" ? link : v,
        },
    },
  
    price: {
        type: Number,
    },
  
    location: {
        type: String,
    }, 

    country: {
        type: String,
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
      }
});

// Middleware : If listing is deleted then delete everything inside it (basically review)
listingSchema.post("findOneAndDelete", async (listing) => {
    // Check if listing has come or not
    if(listing) {
        // Search for ids in reviews present in listing of that particular thing
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;