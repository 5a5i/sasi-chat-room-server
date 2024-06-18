const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.APP_SECRET, { expiresIn: '1h' });
    // userdata = {userId: user._id, token}
    // userdata.push(token);
    // console.log(userdata);

    const paramsId = user._id;
    const filter = { _id: paramsId };
    const options = { upsert: false };
    const updateDoc = { $set: { isActive: true } };
    const result = await User.updateOne(filter, updateDoc, options);

    res.status(200).json({userId: user._id, username: user.username, token});
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout (if using session-based authentication, clear session; not needed for token-based)
const logout = async (req, res) => { 
    
  const paramsId = req.user.id;
  const filter = { _id: paramsId };
  const options = { upsert: false };
  const updateDoc = { $set: { isActive: false } };
  const result = await User.updateOne(filter, updateDoc, options);
  // Clear session or tokens
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout
};
  