const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const sgMail = require("@sendgrid/mail"); // Import SendGrid mail package
require("dotenv").config(); // Load environment variables from .env file
const router = express.Router();

// Load environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

const FINAL_SHEET_ID = process.env.FINAL_SHEET_ID; // Replace with your new Google Sheet ID
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json")); // Load API credentials

async function accessSpreadsheet() {
    const auth = new google.auth.GoogleAuth({
        credentials: CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
}

// ✅ API Route to Save Form Data to Google Sheets (Final Sheet)
router.post("/submit-finalform", async (req, res) => {
    try {
        const BASE_URL = req.app.locals.BASE_URL; // ✅ Get dynamic BASE_URL
        console.log(`Using BASE_URL: ${BASE_URL}`);

        const sheets = await accessSpreadsheet();
        const formData = req.body; // Receive form data from Angular
        const values = [[
            formData.businessName,
            formData.contactPerson,
            formData.mobile,
            formData.businessEmail,
            formData.officePhone,
            formData.contactEmail,
            formData.address,
            formData.bundleSelection,
            formData.howSoon,
            formData.price
        ]];
        // Save data to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: FINAL_SHEET_ID,
            range: "Sheet1!A:J", // Adjust based on the number of fields
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values },
        });
        // Send email to admin
        const adminEmailMessage = {
            to: ADMIN_EMAIL,
            from: SENDER_EMAIL,
            subject: "New Form Submission",
            text: `
                New form submission received:
                Business Name: ${formData.businessName}
                Contact Person: ${formData.contactPerson}
                Mobile: ${formData.mobile}
                Business Email: ${formData.businessEmail}
                Office Phone: ${formData.officePhone}
                Contact Email: ${formData.contactEmail}
                Address: ${formData.address}
                Bundle Selection: ${formData.bundleSelection}
                How Soon: ${formData.howSoon}
                Price: ${formData.price}
            `,
        };
        // Send email to user
        const userEmailMessage = {
            to: formData.contactEmail, // Use the email provided by the user in the form
            from: SENDER_EMAIL,
            subject: "Thank You for Your Submission",
            text: `
                Thank you for submitting your details!
                We have received your information and will get back to you soon.
                Here are the details you submitted:
                Business Name: ${formData.businessName}
                Contact Person: ${formData.contactPerson}
                Mobile: ${formData.mobile}
                Business Email: ${formData.businessEmail}
                Office Phone: ${formData.officePhone}
                Contact Email: ${formData.contactEmail}
                Address: ${formData.address}
                Bundle Selection: ${formData.bundleSelection}
                How Soon: ${formData.howSoon}
                Price: ${formData.price}
            `,
        };
        // Send both emails
        await sgMail.send(adminEmailMessage);
        await sgMail.send(userEmailMessage);
        res.status(200).json({ message: "Data saved successfully and emails sent!" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to save data or send emails" });
    }
});

// Example route
router.get('/', (req, res) => {
  res.send('Final Sheet route is working!');
});

module.exports = router;