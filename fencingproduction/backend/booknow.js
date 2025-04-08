const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const sgMail = require("@sendgrid/mail"); // Import SendGrid mail package
require("dotenv").config(); // Load environment variables
const router = express.Router();

// Load API credentials
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_API_CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));

// Load SendGrid credentials
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const SYSTEM_SENDER_EMAIL = process.env.SYSTEM_SENDER_EMAIL;

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

async function initializeGoogleSheets() {
    const auth = new google.auth.GoogleAuth({
        credentials: GOOGLE_API_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

// ✅ API Route to Save Booking Data & Send Email
router.post("/submit-booking", async (req, res) => {
    try {
        const sheets = await initializeGoogleSheets();
        const bookingDetails = req.body;
        const emailToVerify = bookingDetails.email;

        // Fetch existing emails from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Bookings!B:B", // Column B (Emails)
        });

        const existingEmails = response.data.values ? response.data.values.flat() : [];

        // Check if the email already exists
        if (existingEmails.includes(emailToVerify)) {
            return res.status(400).json({ error: "Email already exists. Booking not submitted." });
        }

        // If email is unique, append new booking
        const rowData = [[
            bookingDetails.name,
            bookingDetails.email,
            bookingDetails.phone,
            bookingDetails.requirements,
            bookingDetails.date    
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Bookings!A:E", // Adjust based on the number of fields
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: rowData },
        });

        // ✅ Send Email Notification
        const adminNotificationEmail = {
            to: ADMIN_NOTIFICATION_EMAIL,
            from: SYSTEM_SENDER_EMAIL,
            subject: "New Booking Submission",
            text: `
                A new booking has been submitted:
                Name: ${bookingDetails.name}
                Email: ${bookingDetails.email}
                Phone: ${bookingDetails.phone}
                Requirements: ${bookingDetails.requirements}
                Date: ${bookingDetails.date}
            `,
        };

        const userConfirmationEmail = {
            to: bookingDetails.email, // Send to user who submitted the form
            from: SYSTEM_SENDER_EMAIL,
            subject: "Booking Confirmation",
            text: `
                Thank you for your booking, ${bookingDetails.name}!
                We have received your request and will get back to you soon.
                
                Booking Details:
                - Name: ${bookingDetails.name}
                - Email: ${bookingDetails.email}
                - Phone: ${bookingDetails.phone}
                - Requirements: ${bookingDetails.requirements}
                - Date: ${bookingDetails.date}

            `,
        };

        await sgMail.send(adminNotificationEmail);
        await sgMail.send(userConfirmationEmail);

        res.status(200).json({ message: "Booking data saved successfully and emails sent!" });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to save booking data or send emails" });
    }
});

// Example route
router.get("/", (req, res) => {
    res.send("Google Sheets Booking API is working!");
});

module.exports = router;