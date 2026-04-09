const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

router.post('/create-order', membershipController.createMembershipOrder);
router.post('/verify-payment', membershipController.verifyMembershipPayment);

module.exports = router;
