const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });
const Student = require("../models/Student");

const router = require('../router');
const connectDatabse = require('./db/connection');
const logger = require('../utils/logger');
connectDatabse();
router.get('/api/students/count', async (req, res) => {
  try {
    const year = req.query.year; // Get the year from the query parameter
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Count the number of students registered in the specified year
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
router.get('/api/students/timestamps', async (req, res) => {
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

const server = router.listen(process.env.PORT, () => {
  console.clear();
  logger.info(`Server is port ${process.env.PORT} in ${process.env.NODE_ENV}`);
  logger.info(`http://localhost:${process.env.PORT}/`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Error name : ${err.name} , Error msg ${err.message}  `);
  logger.error('Shutting down Server due to  Rejection Errors');
  server.close(() => {
    process.exit();
  });
});
