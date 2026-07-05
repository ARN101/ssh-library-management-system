const db = require('../config/db');
const { toPublicBook } = require('../utils/bookMapper');

const getAllBooks = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, author, isbn, category, is_available, quantity, created_at FROM books ORDER BY title ASC'
    );

    return res.status(200).json({
      data: rows.map(toPublicBook),
    });
  } catch (error) {
    console.error('Get books error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT id, title, author, isbn, category, is_available, quantity, created_at FROM books WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({
      data: toPublicBook(rows[0]),
    });
  } catch (error) {
    console.error('Get book error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const qty = Number.isFinite(Number(quantity)) ? Math.max(0, Number(quantity)) : 1;
    const isAvailable = qty > 0;

    const [result] = await db.query(
      `INSERT INTO books (title, author, isbn, category, quantity, is_available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title.trim(), author.trim(), isbn?.trim() || null, category?.trim() || null, qty, isAvailable]
    );

    const [rows] = await db.query(
      'SELECT id, title, author, isbn, category, is_available, quantity, created_at FROM books WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Book added successfully',
      data: toPublicBook(rows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    console.error('Create book error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, quantity } = req.body;

    const [existing] = await db.query('SELECT id FROM books WHERE id = ? LIMIT 1', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const qty = Number.isFinite(Number(quantity)) ? Math.max(0, Number(quantity)) : 0;
    const isAvailable = qty > 0;

    await db.query(
      `UPDATE books
       SET title = ?, author = ?, isbn = ?, category = ?, quantity = ?, is_available = ?
       WHERE id = ?`,
      [title.trim(), author.trim(), isbn?.trim() || null, category?.trim() || null, qty, isAvailable, id]
    );

    const [rows] = await db.query(
      'SELECT id, title, author, isbn, category, is_available, quantity, created_at FROM books WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      message: 'Book updated successfully',
      data: toPublicBook(rows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    console.error('Update book error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
