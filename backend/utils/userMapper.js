const toPublicUser = (row) => ({
  id: row.id,
  email: row.kuet_mail,
  name: row.full_name,
  studentId: row.student_id,
  role: row.role,
});

module.exports = { toPublicUser };
