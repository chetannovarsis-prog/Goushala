const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');

router.get('/generate/:type/:id', generateCertificate);

module.exports = router;
