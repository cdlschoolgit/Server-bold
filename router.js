const express = require('express');
const router = new express();
const cors = require('cors');
const path = require('path');

// var allowlist = [
//   'http://localhost:5173',
//   'https://front-end-nine-gray.vercel.app',
// ];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

const errorMiddleware = require('./middlewares/errors');
router.use(cors());

const studentRoutes = require('./routes/Student');
const teacherRoutes = require('./routes/Teacher');
router.use(express.json());

router.use(studentRoutes);
router.use(teacherRoutes);

router.use(errorMiddleware);

router.set('view engine', 'hbs');
router.set('views', path.join(__dirname, 'views'));
router.use(express.static(path.join(__dirname, 'public')));

module.exports = router;
