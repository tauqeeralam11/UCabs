const express = require('express');
const router = express.Router();
const { bookRide, getUserRides, updateRideStatus, startRide } = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.post('/book', protect, bookRide);
router.get('/history', protect, getUserRides);
router.put('/:id/status', protect, updateRideStatus);
router.put('/:id/start', protect, startRide);

module.exports = router;