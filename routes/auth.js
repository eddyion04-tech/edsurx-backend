const express = require('express');
const router = express.Router();

// Student Login (Temporary)
router.post('/student/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (
    email === 'Student123@gmail.com' &&
    password === 'Student@123'
  ) {
    return res.json({
      success: true,
      message: 'Student login successful',
      token: 'student-demo-token',
      data: { email }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid student credentials'
  });
});

// Admin Login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (email === 'admin@edsurx.com' && password === 'admin123') {
    return res.json({
      success: true,
      message: 'Admin login successful',
      token: 'admin-demo-token',
      data: { email }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid admin credentials'
  });
});

module.exports = router;