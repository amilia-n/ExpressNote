import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/authMiddleware.js';
import * as noteController from '../controllers/noteController.js';

router.post('/newnote', authenticateToken, noteController.createNote);
router.get('/allnotes', authenticateToken, noteController.getAllNotes);
router.get('/:noteId', authenticateToken, noteController.getNoteById);
router.put('/:noteId', authenticateToken, noteController.saveAndUpdate);
router.delete('/:noteId', authenticateToken, noteController.deleteNote);
router.get('/:noteId/description', authenticateToken, noteController.getNoteDescription);
router.put('/:noteId/description', authenticateToken, noteController.updateNoteDescription);

export default router;