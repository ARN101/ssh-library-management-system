const toPublicBook = (row) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  isbn: row.isbn,
  category: row.category,
  is_available: Boolean(row.is_available),
  quantity: row.quantity,
  cover_url: row.cover_url || null,
  created_at: row.created_at,
});

module.exports = { toPublicBook };
