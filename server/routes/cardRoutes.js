const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cardController = require('../controllers/cardController');

module.exports = router;