const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// SSH-8: Student catalog — any authenticated user can browse
router.get('/', authenticate, getAllBooks);
router.get('/:id', authenticate, getBookById);

// SSH-10: Librarian inventory CRUD
router.post('/', authenticate, requireRole('librarian'), createBook);
router.put('/:id', authenticate, requireRole('librarian'), updateBook);
router.delete('/:id', authenticate, requireRole('librarian'), deleteBook);

module.exports = router;
