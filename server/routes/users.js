
const express = require('express');
const router = express.Router();
const { getUserProfile, getProfessionals } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.get('/professionals', protect, getProfessionals);

module.exports = router;
