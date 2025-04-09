const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT_FNG || 3002; // Use PORT_FNG from .env

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Load Routes
const bookNowRoutes = require("./booknow");
app.use("/api/booknow", bookNowRoutes); // Mount the new booking route

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${process.env.BASE_URL_FNG || "http://localhost:" + PORT}`);
});