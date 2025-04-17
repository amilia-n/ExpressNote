const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

router.post('/', authenticateToken, noteController.createNote);
router.get('/:id', authenticateToken, noteController.getNoteById);
router.put('/:id', authenticateToken, noteController.updateNote);
router.delete('/:id', authenticateToken, noteController.deleteNote);

module.exports = router;