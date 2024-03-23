// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('MongoDB connection error:', error);
});

// Define a route to fetch a student by _id
app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
