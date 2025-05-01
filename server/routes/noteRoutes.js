import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import * as noteController from '../controllers/noteController.js';

const router = express.Router();

router.post('/notes', authenticateToken, noteController.createNote);
router.get('/notes', authenticateToken, noteController.getAllNotes);
router.get('/:noteId', authenticateToken, noteController.getNoteById);
router.put('/:noteId', authenticateToken, noteController.updateNoteTitle);
router.delete('/:noteId', authenticateToken, noteController.deleteNote);

export default router;