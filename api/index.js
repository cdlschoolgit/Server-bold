// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const cors = require('cors');
const path = require('path');
// Load environment variables
dotenv.config();

const app = new express();
const errorMiddleware = require('../middlewares/errors');
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


const studentRoutes = require('../routes/Student');
const teacherRoutes = require('../routes/Teacher');
app.use(express.json());

app.use(studentRoutes);
app.use(teacherRoutes);

app.use(errorMiddleware);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/students/count', async (req, res) => {
  try {
    const year = req.query.year; // Get the year from the query parameter
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Count the number of students registered in specified year
    const registeredCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate }
    });

    // Count the number of active students in the specified year
    const activeCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      active: true
    });

    // Count the number of completed students in the specified year
    const completedCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      completed: true
    });

    // Return the counts as JSON response
    res.json({
      year,
      totalRegistered: registeredCount,
      active:activeCount,
      completed: completedCount,
    });
  } catch (error) {
    console.error('Error fetching student counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/students/timestamps', async (req, res) => {
  try {
    // Extract the year from the query parameter
    const { year } = req.query;

    // Check if the year is provided
    if (!year) {
      return res.status(400).json({ success: false, error: 'Year parameter is required' });
    }

    // Parse the year to a number
    const parsedYear = parseInt(year);

    // Check if the year is valid
    if (isNaN(parsedYear)) {
      return res.status(400).json({ success: false, error: 'Invalid year parameter' });
    }

    // Get the start and end date of the provided year
    const startDate = new Date(parsedYear, 0, 1); // January 1st of the year
    const endDate = new Date(parsedYear + 1, 0, 1); // January 1st of the next year

    // Query the database to find students registered within the specified year
    const students = await Student.find({
      createAt: { $gte: startDate, $lt: endDate }
    }, 'createAt');

    // Extract the createAt timestamps from the result
    const timestamps = students.map(student => ({ createAt: student.createAt }));

    // Send the timestamps as a response
    res.json({ success: true, data: timestamps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
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
app.get("/api/",(req,res)=>{
  res.send("working")
})



const checkNumbersStudent = async ({ email, code }) => {
  const studentFound = await Student.findOne({ email, resetPasswordToken: code });
  return !!studentFound;
};

// Define the POST endpoint
app.post("/api/checkNumber", async(req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Email and code are required',
    });
  }

  const result = await checkNumbersStudent({ email, code });

  if (result) {
    return res.status(200).json({
      success: true,
      message: 'Code is verified, please change the password.',
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'Code is incorrect.',
    });
  }
});
// Set the strictQuery option to suppress the deprecation warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect("mongodb+srv://arslanmirza474:arslanmirza474@traffic-assessment.c65esoz.mongodb.net/Traffic-Assessment")
  .then(() => {
    console.log("db is running on port 3003");
    app.listen(3003, () => {
      console.log("db and server is running on port 3003");
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

