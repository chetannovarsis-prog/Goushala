const express = require('express');
const router = express.Router();
const gurukulController = require('../controllers/gurukulController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/apply', gurukulController.apply);
router.get('/', authMiddleware, gurukulController.getApplications);
router.put('/:id/status', authMiddleware, gurukulController.updateApplicationStatus);

module.exports = router;
