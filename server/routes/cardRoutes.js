const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/generate', authenticateToken, cardController.generateFlashcards);

module.exports = router;