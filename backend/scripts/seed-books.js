/**
 * Seed 100+ books with cover images.
 * Usage: node scripts/seed-books.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const { books } = require('../data/books-seed');

async function ensureSchema(conn) {
  await conn.query('ALTER TABLE books MODIFY COLUMN isbn VARCHAR(32) NULL').catch(() => {});

  const [cols] = await conn.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'books' AND COLUMN_NAME = 'cover_url'`
  );

  if (cols.length === 0) {
    await conn.query('ALTER TABLE books ADD COLUMN cover_url VARCHAR(500) NULL');
    console.log('Added cover_url column');
  }
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ssh_library_db',
  });

  console.log(`Seeding ${books.length} books...`);
  await ensureSchema(conn);

  let inserted = 0;
  let updated = 0;

  for (const book of books) {
    const [result] = await conn.query(
      `INSERT INTO books (title, author, isbn, category, quantity, is_available, cover_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         author = VALUES(author),
         category = VALUES(category),
         quantity = VALUES(quantity),
         is_available = VALUES(is_available),
         cover_url = VALUES(cover_url)`,
      [
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.quantity,
        book.is_available ? 1 : 0,
        book.cover_url,
      ]
    );

    if (result.affectedRows === 1) inserted += 1;
    else if (result.affectedRows === 2) updated += 1;
  }

  const [countRows] = await conn.query('SELECT COUNT(*) AS c FROM books');
  const [catRows] = await conn.query(
    'SELECT category, COUNT(*) AS c FROM books GROUP BY category ORDER BY category'
  );

  console.log(`Done. inserted≈${inserted}, updated≈${updated}`);
  console.log(`Total books in DB: ${countRows[0].c}`);
  console.log('By category:');
  catRows.forEach((r) => console.log(`  ${r.category}: ${r.c}`));

  await conn.end();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
