const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateToken = require('../middleware/authMiddleware');
const blockController = require('../controllers/blockController');

router.post('/', authenticateToken, blockController.createBlock);
router.put('/:blockId', authenticateToken, blockController.updateBlock);
router.delete('/:blockId', authenticateToken, blockController.deleteBlock);

module.exports = router;