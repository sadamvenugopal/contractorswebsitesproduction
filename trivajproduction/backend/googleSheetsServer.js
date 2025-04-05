const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const router = express.Router();

// Load API credentials
const SHEET_ID = process.env.SHEET_ID;
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json")); // Load API credentials

async function accessSpreadsheet() {
    const auth = new google.auth.GoogleAuth({
        credentials: CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
}

// ✅ API Route to Save Form Data to Google Sheets
router.post("/submit-clientform", async (req, res) => {
    try {
        const BASE_URL = req.app.locals.BASE_URL; // ✅ Get dynamic BASE_URL
        console.log(`Using BASE_URL: ${BASE_URL}`);
        
        const sheets = await accessSpreadsheet();
        const formData = req.body; // Receive form data from Angular
        const values = [[
            formData.businessName,
            formData.businessDescription,
            formData.targetAudience,
            formData.mainGoal,
            formData.sellProducts,
            formData.visitorActions,
            formData.brandStyle,
            formData.preferredWebsites,
            formData.designPreferences,
            formData.selectDesign,
            formData.layout,
            formData.contentType,
            formData.contentReady,
            formData.contentHelp,
            formData.highQualityImages,
            formData.requiredFeatures,
            formData.integrationsNeeded,
            formData.specialFunctionality,
            formData.seoOptimization,
            formData.googleAnalytics,
            formData.domainName,
            formData.hostingRecommendations,
            formData.preferredCMS,
            formData.timeline,
            formData.budget,
            formData.ongoingMaintenance,
            formData.futureUpdates,
            formData.competitors,
            formData.differentiation,
            formData.name,
            formData.email,
            formData.phone,
            formData.description
        ]];
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!A:AE", // Adjust based on the number of fields
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values },
        });
        res.status(200).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// Example route
router.get('/', (req, res) => {
    res.send('Google Sheets API is working!');
});

module.exports = router;