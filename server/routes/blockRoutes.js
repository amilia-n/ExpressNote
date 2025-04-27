const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateToken = require('../middleware/authMiddleware');
const { validateNoteOwnership, validatePageBelongsToNote } = require('../middleware/validators');
const blockController = require('../controllers/blockController');

router.post('/', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.createBlock);
router.get('/', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.getBlocksByPage);
router.get('/note', authenticateToken, validateNoteOwnership, blockController.getBlocksByNote);
router.put('/:blockId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.updateBlock);
router.delete('/:blockId', authenticateToken, validateNoteOwnership, validatePageBelongsToNote, blockController.deleteBlock);

module.exports = router;