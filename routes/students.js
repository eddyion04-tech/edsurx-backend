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

// GET /api/students/:id
router.get('/:id', (req, res) => {
  const student = students.find((s) => s.id === req.params.id || s._id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, data: { student } });
});

// PUT /api/students/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const studentIndex = students.findIndex((s) => s.id === req.params.id || s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  students[studentIndex].status = status;
  res.json({ success: true, message: 'Student status updated', data: { student: students[studentIndex] } });
});

module.exports = router;
