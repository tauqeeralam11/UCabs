const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { processRealKyc, getPendingDrivers, reviewDriver } = require('../controllers/adminController');

router.post('/submit-kyc', protect, upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'license', maxCount: 1 },
  { name: 'rcBook', maxCount: 1 }
]), processRealKyc);

router.get('/drivers/pending', protect, getPendingDrivers);
router.put('/drivers/:id/review', protect, reviewDriver);

module.exports = router;