import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import * as pageController from '../controllers/pageController.js';

const router = express.Router(); 

router.post('/', authenticateToken, pageController.createPage);
router.get('/', authenticateToken, pageController.getPagesByNoteId);
router.get('/:pageId', authenticateToken, pageController.getPageById);
router.put('/:pageId/position', authenticateToken, pageController.updatePagePosition);
router.delete('/:pageId', authenticateToken, pageController.deletePage);

export default router;