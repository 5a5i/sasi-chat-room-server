const express = require('express');
const router = express.Router();
const { createRoom, getAllRooms } = require('../controllers/roomController');
const authenticateToken = require('../middlewares/authenticateToken');

// Create a new room
router.post('/rooms', authenticateToken, createRoom);

// Get all rooms
router.get('/rooms', getAllRooms);

module.exports = router;
