const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: './config/config.env' });

const router = require('./router');
const connectDatabase = require('./db/connection');
const logger = require('./utils/logger');
const Student = require('./models/Student');
const { getQuestionsManagerHtml } = require('./views/questionsManager');

connectDatabase();

// Question Manager Page Handler (Home Page)
const renderQuestionsPage = (req, res) => {
  if (req.accepts('html')) {
    return res.status(200).send(getQuestionsManagerHtml());
  }

  return res.status(200).json({
    status: 'online',
    service: 'United CDL Training School Question Manager API',
    endpoints: {
      getAllQuestions: 'GET /api/admin/questions',
      updateQuestion: 'PUT /api/admin/questions/:id',
      createQuestion: 'POST /api/admin/questions',
      deleteQuestion: 'DELETE /api/admin/questions/:id',
    },
  });
};

// Neutral Landing Page Handler (Light UI with System Status tab)
const renderNeutralPage = (req, res) => {
  if (req.accepts('html')) {
    return res.status(200).send(getQuestionsManagerHtml('status'));
  }

  return res.status(200).json({
    status: 'online',
    service: 'United CDL Training School API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

// Root & Question Manager Landing Page Endpoints
router.get('/', renderQuestionsPage);
router.get('/questions', renderQuestionsPage);
router.get('/admin/questions', renderQuestionsPage);

// API Status & System Neutral Page Endpoints
router.get('/status', renderNeutralPage);
router.get('/api/status', renderNeutralPage);
router.get('/api', renderQuestionsPage);
router.get('/api/', renderQuestionsPage);

router.get('/students/count', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const registeredCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
    });

    const activeCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      active: true,
    });

    const completedCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      completed: true,
    });

    res.json({
      year,
      totalRegistered: registeredCount,
      active: activeCount,
      completed: completedCount,
    });
  } catch (error) {
    console.error('Error fetching student counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/students/count', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const registeredCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
    });

    const activeCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      active: true,
    });

    const completedCount = await Student.countDocuments({
      createAt: { $gte: startDate, $lte: endDate },
      completed: true,
    });

    res.json({
      year,
      totalRegistered: registeredCount,
      active: activeCount,
      completed: completedCount,
    });
  } catch (error) {
    console.error('Error fetching student counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/students/timestamps', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ success: false, error: 'Year parameter is required' });
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return res.status(400).json({ success: false, error: 'Invalid year parameter' });
    }

    const startDate = new Date(parsedYear, 0, 1);
    const endDate = new Date(parsedYear + 1, 0, 1);

    const students = await Student.find(
      { createAt: { $gte: startDate, $lt: endDate } },
      'createAt'
    );

    const timestamps = students.map((student) => ({ createAt: student.createAt }));
    res.json({ success: true, data: timestamps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/students/timestamps', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ success: false, error: 'Year parameter is required' });
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return res.status(400).json({ success: false, error: 'Invalid year parameter' });
    }

    const startDate = new Date(parsedYear, 0, 1);
    const endDate = new Date(parsedYear + 1, 0, 1);

    const students = await Student.find(
      { createAt: { $gte: startDate, $lt: endDate } },
      'createAt'
    );

    const timestamps = students.map((student) => ({ createAt: student.createAt }));
    res.json({ success: true, data: timestamps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const checkNumbersStudent = async ({ email, code }) => {
  if (!email || !code) return false;
  const cleanEmail = email.toLowerCase().trim();
  const studentFound = await Student.findOne({ email: cleanEmail, resetPasswordToken: String(code) });
  return !!studentFound;
};

router.post('/api/checkNumber', async (req, res) => {
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

const errorMiddleware = require('./middlewares/errors');
router.use(errorMiddleware);

const port = process.env.PORT || 4000;
const server = router.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${process.env.NODE_ENV}`);
  logger.info(`http://localhost:${port}/`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Error name : ${err.name} , Error msg ${err.message}`);
  logger.error('Shutting down Server due to Rejection Errors');
  server.close(() => {
    process.exit();
  });
});
