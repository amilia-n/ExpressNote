import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateNoteOwnership } from '../middleware/validators.js';
import * as noteController from '../controllers/noteController.js';

const router = express.Router();

router.post('/', authenticateToken, noteController.createNote);
router.get('/', authenticateToken, noteController.getAllNotes);
router.get('/:noteId', authenticateToken, validateNoteOwnership, noteController.getNoteById);
router.put('/:noteId', authenticateToken, validateNoteOwnership, noteController.updateNoteTitle);
router.delete('/:noteId', authenticateToken, validateNoteOwnership, noteController.deleteNote);

export default router;