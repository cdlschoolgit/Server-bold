// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();


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

mongoose.connect("mongodb+srv://arslanmirza474:arslanmirza474@traffic-assessment.c65esoz.mongodb.net/Traffic-Assessment").then(() => {
  console.log("db  is running on port 3003 ")
  app.listen(3003, () => {
    console.log("db and server is running on port 3003 ")
  })
});

