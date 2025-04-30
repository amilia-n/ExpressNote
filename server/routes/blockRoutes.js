import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import * as blockController from '../controllers/blockController.js';

const router = express.Router();

router.post('/', authenticateToken, blockController.createBlock);
router.get('/', authenticateToken, blockController.getBlocksByPage);
router.get('/:blockId', authenticateToken, blockController.getBlockById);
router.put('/:blockId', authenticateToken, blockController.updateBlock);
router.delete('/:blockId', authenticateToken, blockController.deleteBlock);

export default router;