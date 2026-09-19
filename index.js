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

// Neutral Landing Page Handler
const renderNeutralPage = (req, res) => {
  if (req.accepts('html')) {
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>United CDL Training School - Server API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #0d2830 0%, #0f5a70 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #ffffff;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 45px 35px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 24px;
    }
    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulseAnim 2s infinite;
    }
    @keyframes pulseAnim {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    h1 {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    p.subtitle {
      font-size: 16px;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 30px;
      text-align: left;
    }
    @media (max-width: 540px) {
      .grid { grid-template-columns: 1fr; }
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 15px;
      color: #f1f5f9;
      font-weight: 500;
    }
    .notice {
      background: rgba(15, 90, 112, 0.4);
      border-left: 4px solid #38bdf8;
      padding: 14px 18px;
      border-radius: 8px;
      font-size: 13.5px;
      color: #e2e8f0;
      line-height: 1.5;
      text-align: left;
      margin-bottom: 25px;
    }
    .footer {
      font-size: 13px;
      color: #94a3b8;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }
    .footer a {
      color: #38bdf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="pulse"></span>
      API SYSTEM OPERATIONAL
    </div>
    <h1>United CDL Training School</h1>
    <p class="subtitle">
      Backend Application Services for Entry-Level Driver Training (ELDT), Student Assessments, and Instructor Administration.
    </p>
    <div class="grid">
      <div class="card">
        <div class="card-title">Service Environment</div>
        <div class="card-desc">Production API Server</div>
      </div>
      <div class="card">
        <div class="card-title">Organization</div>
        <div class="card-desc">United CDL Training School</div>
      </div>
      <div class="card">
        <div class="card-title">Theory Modules</div>
        <div class="card-desc">35 Standards-Compliant Lessons</div>
      </div>
      <div class="card">
        <div class="card-title">Support Contact</div>
        <div class="card-desc">support@unitedeldt.com</div>
      </div>
    </div>
    <div class="notice">
      <strong>Notice:</strong> This server and its API endpoints are proprietary systems owned and operated by United CDL Training School. Access is restricted to authorized students and institutional personnel.
    </div>
    <div style="margin-bottom: 25px;">
      <a href="/" style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; padding: 12px 26px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
        📝 Open Question Manager &rarr;
      </a>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} United CDL Training School. All rights reserved. &bull; <a href="https://www.unitedcdleldt.com" target="_blank">unitedcdleldt.com</a>
    </div>
  </div>
</body>
</html>`);
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
router.get('/api', renderNeutralPage);
router.get('/api/', renderNeutralPage);

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
