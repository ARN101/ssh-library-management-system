const toStudentReservation = (row) => ({
  id: row.id,
  book_title: row.book_title,
  book_author: row.book_author,
  reserved_at: row.reserved_at,
  status: row.status,
});

const toLibrarianReservation = (row) => ({
  id: row.id,
  user_name: row.user_name,
  user_email: row.user_email,
  student_id: row.student_id,
  book_title: row.book_title,
  book_author: row.book_author,
  book_isbn: row.book_isbn,
  reserved_at: row.reserved_at,
  status: row.status,
});

module.exports = { toStudentReservation, toLibrarianReservation };
