const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Fair Fund Flow backend ready' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
