const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authenticateToken, logout);

module.exports = router;
