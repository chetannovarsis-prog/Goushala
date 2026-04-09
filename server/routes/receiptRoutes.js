const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.get('/:donationId', receiptController.generateReceipt);

module.exports = router;
