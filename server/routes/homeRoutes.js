const express = require('express');
const router = express.Router();
const { getRecentActivity } = require('../controllers/homeController');

router.get('/recent-activity', getRecentActivity);

module.exports = router;
