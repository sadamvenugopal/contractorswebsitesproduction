const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// ✅ Load Routes
const bookNowRoutes = require("./booknow");
app.use("/api/booknow", bookNowRoutes); // Mount the new booking route

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${process.env.BASE_URL || "http://localhost:" + PORT}`);
});
