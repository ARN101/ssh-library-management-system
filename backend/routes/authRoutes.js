const express = require('express');
const {
  register,
  login,
  refreshToken,
  getMe,
  logout,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
