const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const membershipPlanController = require('../controllers/membershipPlanController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to get prices
router.get('/cow-price', adminController.getCowPrice);
router.get('/bhandara', adminController.getBhandaraCategories);
router.get('/membership-plans', membershipPlanController.getPlans);

// Protected Admin Routes
router.use(authMiddleware);

router.put('/cow-price', adminController.updateCowPrice);
router.post('/bhandara', adminController.addBhandaraCategory);
router.put('/bhandara/:id', adminController.updateBhandaraCategory);
router.delete('/bhandara/:id', adminController.deleteBhandaraCategory);
router.get('/stats', adminController.getStats);

// Karyakarta
router.get('/karyakartas', adminController.getKaryakartas);
router.post('/karyakartas', adminController.addKaryakarta);
router.delete('/karyakartas/:id', adminController.deleteKaryakarta);

// Students
router.get('/students', adminController.getStudents);
router.post('/students', adminController.addStudent);

// Accounting
router.get('/transactions', adminController.getTransactions);
router.post('/transactions', adminController.addTransaction);
router.put('/transactions/:id', adminController.updateTransaction);
router.delete('/transactions/:id', adminController.deleteTransaction);

// Memberships
router.get('/memberships', adminController.getMemberships);
router.get('/memberships/:id', adminController.getMembershipById);
router.post('/memberships', adminController.addMembership);
router.put('/memberships/:id', adminController.updateMembership);
router.delete('/memberships/:id', adminController.deleteMembership);

// Donations (Admin)
router.get('/donations', adminController.getDonations);
router.get('/donations/:id', adminController.getDonationById);
router.put('/donations/:id', adminController.updateDonation);
router.delete('/donations/:id', adminController.deleteDonation);

// Membership Plans Admin
router.post('/membership-plans', membershipPlanController.createPlan);
router.put('/membership-plans/:id', membershipPlanController.updatePlan);
router.delete('/membership-plans/:id', membershipPlanController.deletePlan);

module.exports = router;
