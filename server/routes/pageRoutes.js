import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateNoteOwnership, validatePageBelongsToNote } from '../middleware/validators.js';
import * as pageController from '../controllers/pageController.js';

const router = express.Router({ mergeParams: true }); 

router.post('/', authenticateToken, validateNoteOwnership, pageController.createPage);
router.get('/', authenticateToken, validateNoteOwnership, pageController.getPagesByNoteId);
router.get('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.getPageById);
router.put('/:pageId/position', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.updatePagePosition);
router.put('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.updatePagePosition);
router.delete('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.deletePage);

export default router;