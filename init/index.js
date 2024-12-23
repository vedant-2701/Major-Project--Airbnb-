const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});

    // Add owner to each listing
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67658b09841b6a1b82b318f9" }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();