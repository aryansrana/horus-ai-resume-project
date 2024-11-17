import { createApp } from "./createApp";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = createApp();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose


if (!process.env.MONGO_USERNAME || !process.env.MONGO_PASSWORD || !process.env.MONGO_DATABASE) {
    console.error("Please define the MONGO_USERNAME, MONGO_PASSWORD, and MONGO_DATABASE environment variable.");
    process.exit(1);
}

// Add Function in index.ts?

const dbUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.gsref.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`

//mongoose.connect('mongodb://username:password@host:port/database?options...');
//`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.gsref.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;


mongoose.connect(dbUri)
.then(() => {
    console.log("Connected to MongoDB successfully");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});


// Root route
app.get('/api', (request, response) => {
    response.send("API is running");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
