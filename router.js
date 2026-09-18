const express = require('express');
const router = express();
const cors = require('cors');
const path = require('path');

const studentRoutes = require('./routes/Student');
const teacherRoutes = require('./routes/Teacher');

router.use(cors());
router.use(express.json());

router.set('view engine', 'hbs');
router.set('views', path.join(__dirname, 'views'));
router.use(express.static(path.join(__dirname, 'public')));

router.use(studentRoutes);
router.use(teacherRoutes);

module.exports = router;
