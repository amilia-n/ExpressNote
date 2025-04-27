const express = require('express');
const router = express.Router({ mergeParams: true }); 
const authenticateToken = require('../middleware/authMiddleware');
const { validateNoteOwnership, validatePageBelongsToNote } = require('../middleware/validators');
const pageController = require('../controllers/pageController');

router.post('/', authenticateToken, validateNoteOwnership, pageController.createPage);
router.get('/', authenticateToken, validateNoteOwnership, pageController.getAllPages);
router.get('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.getPageById);
router.put('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.updatePagePosition);
router.delete('/:pageId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, pageController.deletePage);

module.exports = router;