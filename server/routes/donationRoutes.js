const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/create-order', donationController.createOrder);
router.post('/verify-payment', donationController.verifyPayment);
router.get('/', donationController.getDonations); // Admin might use this, or we can move it to adminRoutes

module.exports = router;
