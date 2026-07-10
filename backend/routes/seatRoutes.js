const express = require('express');
const {
  getAllSeats,
  updateSeatStatus,
} = require('../controllers/seatController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all seats
router.get('/', authenticate, getAllSeats);

// Book or free a seat
router.patch('/:id/status', authenticate, updateSeatStatus);

module.exports = router;
