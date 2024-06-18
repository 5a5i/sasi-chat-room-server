const express = require('express');
const router = express.Router();
const { createMessage, getMessagesByRoomId } = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authenticateToken');

// Create a new message
router.post('/messages', authenticateToken, createMessage);

// Get messages by roomId
router.get('/messages/:roomId', getMessagesByRoomId);

router.get('/protected', authenticateToken, (req, res) => {
    // Only reaches here if authenticated
res.json({ message: 'Authenticated successfully', user: req.user });
});

module.exports = router;
