const db = require('../config/db');

// Fetch all seats and their current status (includes occupant for librarians)
const getAllSeats = async (req, res) => {
  try {
    const [seats] = await db.query(
      `SELECT s.id, s.seat_number, s.status, s.user_id,
              u.full_name AS user_name, u.student_id, u.kuet_mail AS user_email
       FROM seats s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.seat_number ASC`
    );

    const isLibrarian = req.user?.role === 'librarian';

    const data = seats.map((seat) => {
      if (isLibrarian) {
        return seat;
      }

      // Students only see occupant details for their own seat
      if (Number(seat.user_id) === Number(req.user?.id)) {
        return seat;
      }

      return {
        id: seat.id,
        seat_number: seat.seat_number,
        status: seat.status,
        user_id: seat.user_id,
      };
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Get all seats error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle or update seat status (book or release)
const updateSeatStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'take' or 'free'
    const userId = req.user.id;

    if (!['take', 'free'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be "take" or "free".' });
    }

    const [seats] = await db.query('SELECT * FROM seats WHERE id = ? LIMIT 1', [id]);

    if (seats.length === 0) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const seat = seats[0];

    if (action === 'take') {
      if (seat.status === 'taken') {
        return res.status(400).json({ message: 'Seat is already taken' });
      }

      // Check if user already has a seat booked
      const [userSeats] = await db.query('SELECT id FROM seats WHERE user_id = ? LIMIT 1', [userId]);
      if (userSeats.length > 0) {
        return res.status(400).json({ message: 'You already have a seat booked. Please free it first.' });
      }

      await db.query(
        'UPDATE seats SET status = "taken", user_id = ? WHERE id = ?',
        [userId, id]
      );
      return res.status(200).json({ message: 'Seat booked successfully' });
    }

    if (action === 'free') {
      if (seat.status === 'available') {
        return res.status(400).json({ message: 'Seat is already available' });
      }

      // Ensure the user is the one freeing the seat, or is a librarian
      if (seat.user_id !== userId && req.user.role !== 'librarian') {
        return res.status(403).json({ message: 'You can only free your own seat' });
      }

      await db.query(
        'UPDATE seats SET status = "available", user_id = NULL WHERE id = ?',
        [id]
      );
      return res.status(200).json({ message: 'Seat freed successfully' });
    }
  } catch (error) {
    console.error('Update seat status error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllSeats,
  updateSeatStatus,
};
