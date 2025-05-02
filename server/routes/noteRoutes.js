import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import * as noteController from '../controllers/noteController.js';

const router = express.Router();

router.post('/', authenticateToken, noteController.createNote);
router.get('/', authenticateToken, noteController.getAllNotes);
router.get('/:noteId', authenticateToken, noteController.getNoteById);
router.put('/:noteId', authenticateToken, noteController.updateNoteTitle);
router.delete('/:noteId', authenticateToken, noteController.deleteNote);

router.use((err, req, res, next) => {
    console.error('Note route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
export default router;