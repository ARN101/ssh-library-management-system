const express = require('express');
const {
  getAllSeats,
  updateSeatStatus,
} = require('../controllers/seatController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getAllSeats);
router.patch('/:id/status', authenticate, updateSeatStatus);

module.exports = router;
