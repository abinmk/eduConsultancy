const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const jwtSecret = process.env.JWT_SECRET;

const client = twilio(accountSid, authToken);

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, mobileNumber } = req.body;

  try {
    let user = await User.findOne({ mobileNumber });
    if (user) {
      return res.status(400).json({ message: 'User with this mobile number already exists' });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Save user details in temp storage
    const tempUserStore = { name, email, mobileNumber };

    // Send OTP
    const verification = await client.verify.services(serviceSid)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', verification });
  } catch (error) {
    console.error('Error during registration and sending OTP:', error);
    res.status(500).json({ message: 'Failed to register user and send OTP', error: error.message });
  }
});

// Send OTP for login
router.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: 'User not registered' });
    }

    const verification = await client.verify.services(serviceSid)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', verification });
  } catch (error) {
    console.error('Error during sending OTP for login:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, code } = req.body;

  try {
    const verificationCheck = await client.verify.services(serviceSid)
      .verificationChecks
      .create({ to: mobileNumber, code });

    if (verificationCheck.status === 'approved') {
      const token = jwt.sign({ mobileNumber }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ message: 'OTP verified successfully', token });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
      const user = await User.findOne({ mobileNumber: req.user.mobileNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
  });
  

module.exports = router;
