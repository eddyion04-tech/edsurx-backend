const express = require('express');
const router = express.Router();

router.post('/send-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  if (phone === '1234567890') {
    return res.json({ success: true, message: 'OTP sent', data: { phone, otp: '1234' } });
  }

  return res.status(401).json({ success: false, message: 'Phone number not authorized' });
});

router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body || {};
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
  }

  if (phone === '1234567890' && otp === '1234') {
    return res.json({ success: true, message: 'OTP verified', token: 'demo-token', data: { phone } });
  }

  return res.status(401).json({ success: false, message: 'Invalid OTP' });
});

router.post('/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email === 'admin@edsurx.com' && password === 'admin123') {
    return res.json({ success: true, message: 'Admin login successful', token: 'admin-demo-token', data: { email } });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

module.exports = router;
