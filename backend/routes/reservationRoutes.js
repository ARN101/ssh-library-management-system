const express = require('express');
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// SSH-12: Student reservation flow
router.post('/', authenticate, requireRole('student'), createReservation);
router.get('/my', authenticate, getMyReservations);

// SSH-12 / SSH-14: Librarian reservation management
router.get('/', authenticate, requireRole('librarian'), getAllReservations);
router.patch('/:id/status', authenticate, requireRole('librarian'), updateReservationStatus);

module.exports = router;
