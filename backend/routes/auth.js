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

// Send OTP for registration
router.post('/send-otp-register', async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const verification = await client.verify.services(serviceSid)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', verification });
  } catch (error) {
    console.error('Error during sending OTP for registration:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify OTP for login
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, code } = req.body;

  try {
    const verificationCheck = await client.verify.services(serviceSid)
      .verificationChecks
      .create({ to: mobileNumber, code });

    if (verificationCheck.status === 'approved') {
      const user = await User.findOne({ mobileNumber });
      const token = jwt.sign({ id: user._id, mobileNumber: user.mobileNumber }, jwtSecret, {
        expiresIn: '1h',
      });

      res.status(200).json({
        message: 'OTP verified successfully',
        token,
        userExists: !!user,
        user: user ? { name: user.name, email: user.email, mobileNumber: user.mobileNumber } : null
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
});

// Verify OTP for registration and register the user
router.post('/verify-otp-register', async (req, res) => {
  const { name, email, mobileNumber, state, counselling, code } = req.body;

  try {
    const verificationCheck = await client.verify.services(serviceSid)
      .verificationChecks
      .create({ to: mobileNumber, code });

    if (verificationCheck.status === 'approved') {
      const newUser = new User({ name, email, mobileNumber, state, counselling });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, mobileNumber: newUser.mobileNumber }, jwtSecret, {
        expiresIn: '1h',
      });

      res.status(200).json({
        message: 'OTP verified and user registered successfully',
        token,
        user: { name: newUser.name, email: newUser.email, mobileNumber: newUser.mobileNumber }
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification for registration:', error);
    res.status(500).json({ message: 'Failed to verify OTP and register user', error: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}

module.exports = router;
