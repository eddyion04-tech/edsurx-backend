const express = require('express');
const router = express.Router();

let students = [];

router.post('/', (req, res) => {
  const student = {
    id: `stu-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };

  students.push(student);
  res.json({ success: true, message: 'Student registered', data: { student } });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: { students } });
});

module.exports = router;
