const express = require('express');
const router = express.Router({ mergeParams: true }); 
const authenticateToken = require('../middleware/authMiddleware');
const pageController = require('../controllers/pageController');

router.post('/', authenticateToken, pageController.createPage);
router.put('/:pageId', authenticateToken, pageController.updatePagePosition);
router.delete('/:pageId', authenticateToken, pageController.deletePage);

module.exports = router;