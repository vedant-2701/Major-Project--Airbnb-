if(process.env.NODE_ENV !== "production")  {
    // This is for development purpose not production
    require('dotenv').config();     // This will load all the environment variables from .env file
}


const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
// const { listingSchema, reviewSchema } = require("./utils/schema");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,  // time period in seconds
}); 

const sessionOptions = { 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // days * hr/day * min/hr * sec/min * milli/sec
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


app.use(session(sessionOptions));
app.use(flash());

// User authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());       // Store user related info in session
passport.deserializeUser(User.deserializeUser());   // Delete user related info from session


main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    await mongoose.connect(process.env.ATLAS_DB_URL);
}


/*
// Root
app.get("/", (req, res) => {
    res.send("Root wroking");
});
*/

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

/*
// Demo User
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "abc@xyz.com",
        username: "abcd@123",
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})
*/

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// Testing Route
app.get("/testListing", wrapAsync (async (req, res) => {

    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        price: 10000,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Sample was saved");

    res.send("Sample was saved succesfully");    
}));


/* Error handling */

// Any route that is not present above is basically page not found
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went Wrong!!" } = err;

    // res.status(statusCode).send(message);
    res.status(statusCode).render("error/error", { message });
});

// Server on PORT
app.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
