const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables (.env in root or config/config.env)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const connectDatabase = require('../db/connection');
const Student = require('../models/Student');
const errorMiddleware = require('../middlewares/errors');
const studentRoutes = require('../routes/Student');
const teacherRoutes = require('../routes/Teacher');
const { getQuestionsManagerHtml } = require('../views/questionsManager');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('Error connecting to database in request:', err);
  }
  next();
});

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
app.get('/', renderQuestionsPage);
app.get('/questions', renderQuestionsPage);
app.get('/admin/questions', renderQuestionsPage);

// API Status & System Neutral Page Endpoints
app.get('/status', renderNeutralPage);
app.get('/api/status', renderNeutralPage);
app.get('/api', renderQuestionsPage);
app.get('/api/', renderQuestionsPage);

// Mount main Student and Teacher routes
app.use(studentRoutes);
app.use(teacherRoutes);

// Student Analytics & Helper Endpoints
app.get('/api/students/count', async (req, res) => {
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

app.get('/api/students/timestamps', async (req, res) => {
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
      {
        createAt: { $gte: startDate, $lt: endDate },
      },
      'createAt'
    );

    const timestamps = students.map((s) => ({ createAt: s.createAt }));
    res.json({ success: true, data: timestamps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/students/:id', async (req, res) => {
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

app.post('/api/checkNumber', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Email and code are required',
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const studentFound = await Student.findOne({
    email: cleanEmail,
    resetPasswordToken: String(code),
  });

  if (studentFound) {
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

// Centralized Error Middleware
app.use(errorMiddleware);

// Export for Vercel Serverless
module.exports = app;

// Run standalone server if executed directly
if (require.main === module) {
  const port = process.env.PORT || 4000;
  connectDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
}
