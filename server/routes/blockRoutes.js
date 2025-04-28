import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateNoteOwnership, validatePageBelongsToNote } from '../middleware/validators.js';
import * as blockController from '../controllers/blockController.js';

const router = express.Router({ mergeParams: true });

router.post('/', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.createBlock);
router.get('/', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.getBlocksByPage);
router.get('/:blockId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.getBlockById);
router.put('/:blockId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.updateBlock);
router.delete('/:blockId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.deleteBlock);

export default router;