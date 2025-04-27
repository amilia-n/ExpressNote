const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

router.post('/', authenticateToken, noteController.createNote);
router.put('/:id', authenticateToken, noteController.updateNoteTitle);
router.delete('/:id', authenticateToken, noteController.deleteNote);
router.get('/:id', authenticateToken, noteController.getNoteById);
router.get('/', authenticateToken, noteController.getAllNotes);

module.exports = router;