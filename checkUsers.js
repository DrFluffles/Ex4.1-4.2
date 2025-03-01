require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const User = require("./models/user"); // Import User model
const config = require("./utils/config"); // Import config to get MONGODB_URI

async function checkUsers() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log("Users in database:", users);

    mongoose.connection.close(); // Close connection after checking
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

checkUsers();
