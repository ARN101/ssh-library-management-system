const bcrypt = require('bcrypt');
const db = require('../config/db');
const { toPublicUser } = require('../utils/userMapper');
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/tokens');

const KUET_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(stud\.)?kuet\.ac\.bd$/i;
const SALT_ROUNDS = 10;

const isKuetEmail = (email) => KUET_EMAIL_REGEX.test(email);

/** @stud.kuet.ac.bd → student; @kuet.ac.bd → librarian */
const deriveRole = (email) => {
  const lower = String(email).toLowerCase();
  if (lower.endsWith('@stud.kuet.ac.bd')) return 'student';
  if (lower.endsWith('@kuet.ac.bd')) return 'librarian';
  return 'student';
};

const deriveStudentId = (email, studentId) => {
  if (studentId && String(studentId).trim()) {
    return String(studentId).trim().slice(0, 64);
  }

  // Use full email local-part for uniqueness (column allows 64 chars)
  const localPart = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._+-]/g, '');
  return localPart.slice(0, 64) || `u${Date.now()}`.slice(0, 64);
};

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.kuet_mail,
  role: user.role,
});

const register = async (req, res) => {
  try {
    const { name, email, password, student_id: studentIdBody } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isKuetEmail(email)) {
      return res.status(400).json({
        message: 'Please use a valid KUET email address (@kuet.ac.bd or @stud.kuet.ac.bd)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const studentId = deriveStudentId(email, studentIdBody);
    const role = deriveRole(email);

    const [existing] = await db.query(
      'SELECT id FROM users WHERE kuet_mail = ? OR student_id = ? LIMIT 1',
      [email.toLowerCase(), studentId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'User with this email or student ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.query(
      `INSERT INTO users (kuet_mail, password_hash, full_name, student_id, role)
       VALUES (?, ?, ?, ?, ?)`,
      [email.toLowerCase(), passwordHash, name.trim(), studentId, role]
    );

    return res.status(201).json({
      message: 'Registered successfully',
      data: {
        user: {
          id: result.insertId,
          email: email.toLowerCase(),
          name: name.trim(),
          studentId,
          role,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.query(
      'SELECT id, kuet_mail, password_hash, full_name, student_id, role FROM users WHERE kuet_mail = ? LIMIT 1',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = buildTokenPayload(user);
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      message: 'Logged in successfully',
      data: {
        user: toPublicUser(user),
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const [rows] = await db.query(
      'SELECT id, kuet_mail, full_name, student_id, role FROM users WHERE id = ? LIMIT 1',
      [decoded.id]
    );

    if (rows.length === 0) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];
    const accessToken = createAccessToken(buildTokenPayload(user));

    return res.status(200).json({
      data: {
        accessToken,
        user: toPublicUser(user),
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, kuet_mail, full_name, student_id, role FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      data: {
        user: toPublicUser(rows[0]),
      },
    });
  } catch (error) {
    console.error('Get me error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = (req, res) => {
  clearRefreshTokenCookie(res);
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  logout,
};
