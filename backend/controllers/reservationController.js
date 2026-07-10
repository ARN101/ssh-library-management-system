const db = require('../config/db');
const {
  toStudentReservation,
  toLibrarianReservation,
} = require('../utils/reservationMapper');

const VALID_STATUSES = ['pending', 'issued', 'cancelled', 'returned'];

const VALID_TRANSITIONS = {
  pending: ['issued', 'cancelled'],
  issued: ['returned', 'cancelled'],
  returned: [],
  cancelled: [],
};

const STUDENT_RESERVATION_SELECT = `
  SELECT r.id, r.reserved_at, r.status,
         b.title AS book_title, b.author AS book_author
  FROM reservations r
  JOIN books b ON r.book_id = b.id
`;

const LIBRARIAN_RESERVATION_SELECT = `
  SELECT r.id, r.reserved_at, r.status,
         u.full_name AS user_name, u.kuet_mail AS user_email, u.student_id,
         b.title AS book_title, b.author AS book_author, b.isbn AS book_isbn
  FROM reservations r
  JOIN users u ON r.user_id = u.id
  JOIN books b ON r.book_id = b.id
`;

const adjustBookQuantity = async (connection, bookId, delta) => {
  const [books] = await connection.query(
    'SELECT id, quantity FROM books WHERE id = ? FOR UPDATE',
    [bookId]
  );

  if (books.length === 0) {
    throw new Error('BOOK_NOT_FOUND');
  }

  const newQuantity = books[0].quantity + delta;

  if (newQuantity < 0) {
    throw new Error('INSUFFICIENT_QUANTITY');
  }

  await connection.query(
    'UPDATE books SET quantity = ?, is_available = ? WHERE id = ?',
    [newQuantity, newQuantity > 0, bookId]
  );
};

const createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }

    const [books] = await db.query(
      'SELECT id, title, is_available, quantity FROM books WHERE id = ? LIMIT 1',
      [bookId]
    );

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = books[0];

    if (!book.is_available || book.quantity <= 0) {
      return res.status(400).json({ message: 'This book is currently unavailable' });
    }

    const [existing] = await db.query(
      `SELECT id FROM reservations
       WHERE user_id = ? AND book_id = ? AND status IN ('pending', 'issued')
       LIMIT 1`,
      [req.user.id, bookId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'You already have an active reservation for this book',
      });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, book_id, status)
       VALUES (?, ?, 'pending')`,
      [req.user.id, bookId]
    );

    const [rows] = await db.query(
      `${STUDENT_RESERVATION_SELECT} WHERE r.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Reservation submitted successfully',
      data: toStudentReservation(rows[0]),
    });
  } catch (error) {
    console.error('Create reservation error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const [rows] = await db.query(
      `${STUDENT_RESERVATION_SELECT}
       WHERE r.user_id = ?
       ORDER BY r.reserved_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      data: rows.map(toStudentReservation),
    });
  } catch (error) {
    console.error('Get my reservations error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const [rows] = await db.query(
      `${LIBRARIAN_RESERVATION_SELECT}
       ORDER BY r.reserved_at DESC`
    );

    return res.status(200).json({
      data: rows.map(toLibrarianReservation),
    });
  } catch (error) {
    console.error('Get all reservations error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateReservationStatus = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT id, user_id, book_id, status FROM reservations WHERE id = ? FOR UPDATE',
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservation = rows[0];
    const allowed = VALID_TRANSITIONS[reservation.status] || [];

    if (!allowed.includes(status)) {
      await connection.rollback();
      return res.status(400).json({
        message: `Cannot change status from "${reservation.status}" to "${status}"`,
      });
    }

    if (status === 'issued') {
      await adjustBookQuantity(connection, reservation.book_id, -1);
    }

    if (status === 'returned' || (status === 'cancelled' && reservation.status === 'issued')) {
      await adjustBookQuantity(connection, reservation.book_id, 1);
    }

    await connection.query('UPDATE reservations SET status = ? WHERE id = ?', [
      status,
      id,
    ]);

    await connection.commit();

    const [updated] = await db.query(
      `${LIBRARIAN_RESERVATION_SELECT} WHERE r.id = ?`,
      [id]
    );

    return res.status(200).json({
      message: `Reservation ${status} successfully`,
      data: toLibrarianReservation(updated[0]),
    });
  } catch (error) {
    await connection.rollback();

    if (error.message === 'INSUFFICIENT_QUANTITY') {
      return res.status(400).json({ message: 'Book is out of stock' });
    }

    console.error('Update reservation status error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
};
