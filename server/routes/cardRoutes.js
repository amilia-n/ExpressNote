const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/generate', authenticateToken, cardController.generateFlashcards);
router.get('/:note_id', authenticateToken, cardController.getFlashcardsByNote);
router.put('/:card_id', authenticateToken, cardController.updateFlashcard);

module.exports = router;