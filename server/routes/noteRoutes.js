const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { validateNoteOwnership } = require('../middleware/validators');
const noteController = require('../controllers/noteController');

router.post('/', authenticateToken, noteController.createNote);
router.get('/', authenticateToken, noteController.getAllNotes);
router.get('/:id', authenticateToken, validateNoteOwnership, noteController.getNoteById);
router.put('/:id', authenticateToken, validateNoteOwnership, noteController.updateNoteTitle);
router.delete('/:id', authenticateToken, validateNoteOwnership, noteController.deleteNote);

module.exports = router;