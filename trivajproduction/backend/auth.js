// auth.js

require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const sgMail = require('@sendgrid/mail');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const router = express.Router();
const crypto = require('crypto');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';


// Initialize Firebase Admin
initializeApp({ credential: applicationDefault() });
const db = getFirestore();
const usersCollection = db.collection('users');

// Initialize SendGrid with the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Session setup for Passport
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // ✅ Secure only in production
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true, // Prevent access via JavaScript
      sameSite: 'lax' // Default to lax
    }
  })
);

router.use(passport.initialize());
router.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.PROD_BASE_URL}/api/auth/google/callback`
    : `${process.env.BASE_URL}/api/auth/google/callback`;
// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // Check if the user already exists in Firestore
    let userQuery = await usersCollection.where('email', '==', email).where('provider', '==', 'google').get();

    if (userQuery.empty) {
      // Create a new user document in Firestore
      const newUserRef = usersCollection.doc();
      await newUserRef.set({
        email,
        name,
        provider: 'google',
        verified: true, // Social logins are automatically verified
        createdAt: new Date().toISOString()
      });

      // Fetch the newly created user document
      userQuery = await usersCollection.doc(newUserRef.id).get();

      // Send a welcome email to the new user
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Welcome to Trivaj!',
        text: `Hi ${name},\n\nWelcome to Trivaj! We're excited to have you on board.`,
        html: `Hi ${name},<br>Welcome to Trivaj! We're excited to have you on board.`
      };
      await sgMail.send(msg);
    } else {
      // User already exists, fetch the first matching document
      userQuery = userQuery.docs[0];
    }

    // Generate JWT token for the user
    const user = userQuery.data();
    const token = jwt.sign({ userId: userQuery.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return done(null, { token, user });
  } catch (error) {
    console.error('Error during Google OAuth:', error);
    return done(error, false);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`, // ✅ Dynamic URL
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook profile:', profile); // Add this line for debugging

    let email = '';
    let name = '';

    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
    } else {
      console.warn('No email found in the Facebook profile.');
      return done(null, false, { message: 'No email found in the Facebook profile.' });
    }

    if (profile.name && profile.name.givenName && profile.name.familyName) {
      name = `${profile.name.givenName} ${profile.name.familyName}`;
    } else if (profile.displayName) {
      name = profile.displayName;
    } else {
      console.warn('No name found in the Facebook profile.');
      name = 'Unknown User';
    }

    let userQuery = await usersCollection.where('email', '==', email).where('provider', '==', 'facebook').get();
    if (userQuery.empty) {
      const newUserRef = usersCollection.doc();
      await newUserRef.set({
        email,
        name,
        provider: 'facebook',
        verified: true, // Social logins are automatically verified
        createdAt: new Date().toISOString()
      });
      userQuery = await usersCollection.doc(newUserRef.id).get();
    } else {
      userQuery = userQuery.docs[0];
    }
    const user = userQuery.data();
    const token = jwt.sign({ userId: userQuery.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return done(null, { token, user });
  } catch (error) {
    console.error('Error during Facebook OAuth:', error);
    return done(error, false);
  }
}));

// Google Login Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const { token, user } = req.user;
  console.log('Google OAuth Success - Token:', token); // Debugging log
  res.redirect(`${FRONTEND_URL}/home?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
});

// Facebook Login Routes
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const { token, user } = req.user;
  console.log('Facebook OAuth Success - Token:', token); // Debugging log
  res.redirect(`${FRONTEND_URL}/home?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
});

// User Registration with Email Verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Input Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const userDoc = await usersCollection.where('email', '==', email).get();
    if (!userDoc.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document with verified: false
    const newUserRef = usersCollection.doc();
    const newUserData = {
      name,
      email,
      phone,
      password: hashedPassword,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await newUserRef.set(newUserData);
      console.log('User saved successfully:', newUserRef.id);
    } catch (dbError) {
      console.error('Error saving user to Firestore:', dbError);
      return res.status(500).json({ message: 'Error saving user' });
    }

    // Generate verification token
    let verificationToken;
    try {
      verificationToken = jwt.sign({ userId: newUserRef.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return res.status(500).json({ message: 'Error generating verification token' });
    }

     // ✅ Dynamic verification link
     const verificationLink = `${BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<a href="${verificationLink}">Verify Email</a>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(201).json({ message: 'User registered successfully. Check your email to verify your account.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify Email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    if (userData.verified) {
      return res.json({ message: 'Account already verified' });
    }

    await usersCollection.doc(userId).update({ verified: true });

    // ✅ Redirect to frontend after verification
    res.redirect(`${process.env.FRONTEND_URL}/`);  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Resend Verification Email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const userQuery = await usersCollection.where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();
    if (user.verified) {
      return res.json({ message: 'Account already verified' });
    }

    const verificationToken = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const verificationLink = `${BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Resend Verification Email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<a href="${verificationLink}">Verify Email</a>`,
    };

    await sgMail.send(msg);
    res.json({ message: 'Verification email resent' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userQuery = await usersCollection.where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(400).json({ message: 'Cannot find user' });
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Input Validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const userQuery = await usersCollection.where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userQuery.docs[0];
    const userId = userDoc.id;

    // Generate JWT reset token
    const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Save token and expiration in Firestore
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15); // 15 min expiry

    await usersCollection.doc(userId).update({
      resetToken,
      resetTokenExpiration: expirationTime.toISOString(),
    });

    // Encode token for safe URL passing
    const encodedToken = encodeURIComponent(resetToken);
    const resetLink = `${FRONTEND_URL}/reset-password?token=${encodedToken}`;

    console.log("Generated Reset Token:", resetToken);
    console.log("Reset Link Sent:", resetLink);

    // Send email using SendGrid
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}. This link will expire in 15 minutes.`,
      html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };
    await sgMail.send(msg);
    res.json({ message: 'Password reset email sent' });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Find user by userId
      const userDoc = await usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userDoc.data();

      // Validate token expiration
      if (new Date(user.resetTokenExpiration) < new Date()) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password & remove reset token
      await usersCollection.doc(userId).update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null
      });

      res.json({ message: 'Password reset successfully' });

    } catch (jwtError) {
      console.error('JWT Error:', jwtError);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Example route
router.get('/', (req, res) => {
  res.send('Auth route is working!');
});

module.exports = router;