const mongoose = require("mongoose");
const Restaurant = require("./src/models/Restaurant");
const restaurants = require("../restaurants.json"); // Assuming this file exists in root project dir as per context, wait, user created it where? 
// The user created file:///Users/ranvendrapratapsingh/Documents/Personal%20Projects/Eats/restaurants.json
// This script will be in server/seed.js. So path to json is ../restaurants.json? No, server is in Eats/server. 
// If script is in Eats/server/seed.js, then Eats/restaurants.json is ../restaurants.json.

require("dotenv").config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        // Clear existing data
        await Restaurant.deleteMany({});
        console.log("Cleared existing restaurants.");

        // Insert new data
        await Restaurant.insertMany(restaurants);
        console.log(`Seeded ${restaurants.length} restaurants successfully!`);

        mongoose.connection.close();
        console.log("Connection closed.");
    } catch (err) {
        console.error("Error seeding DB:", err);
        mongoose.connection.close();
    }
};

seedDB();
