const express = require('express');
const multer = require('multer');
const {
  makeApplicationForEnrollment,
  getApplicationForEnrollmentByEmail,
} = require('../controllers/ApplicationForEnrollment');
const {
  makeDataCollection,
  getDataCollectionByEmail,
  getBasicInfo,
} = require('../controllers/DataCollectionForm');
const {
  makeAgreement,
  getAgreementByEmail,
} = require('../controllers/EnrollmentAgreement');

const {
  loginStudent,
  createStudent,
  getStudents,
  getMyInfo,
  activateStudent,
  deleteAllStudentAccount,
  uploadFiles,
  attempQuiz,
  getStudentsAggregate,
  changePassword,
  checkNumbers,
  generateNumbers,
  getStudentsAggregateByTerm,
} = require('../controllers/Student');

const { deleteStudentAccounts } = require('../services/Student');
const {
  getAllChapters,
  getChapter,
  getResultsOfChapterOfStudent,
  getResultsOfChapterOfStudentUpdated,
  getChapterQuestion,
  getAllChaptersByStudentId,
  videoUpdate,
  getChapterByStudentId,
  updateTheIdOfStudentInModules,
} = require('../controllers/Quiz');
const {
  makeFormData,
  checkForm,
  getFormDataByStudentId,
} = require('../controllers/Form');

// ---------------- Router
const router = express.Router();

// ---------------- Multer

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ---------------- Functions

router
  .route('/updateTheIdOfStudentInModules')
  .get(updateTheIdOfStudentInModules);

router
  .route('/getAllModulesByStudentId/:studentId')
  .get(getAllChaptersByStudentId);
router
  .route('/getChapterByStudentId/:studentId/:chapterNo')
  .get(getChapterByStudentId);

router.route('/getAllModules').get(getAllChapters);
router.route('/getModule/:chapterId').get(getChapter);
router.route('/getQuestionsByModule/:chapterId').get(getChapterQuestion);
router.route('/getMyResults/:studentId').get(getResultsOfChapterOfStudent);
router
  .route('/getMyResultsChapter/:studentId')
  .get(getResultsOfChapterOfStudentUpdated);

router.route('/loginStudent').post(loginStudent);
router.route('/createStudent').post(createStudent);
router.route('/getAllStudents').get(getStudents);
router.route('/getMyInfo/:id').get(getMyInfo);
router.route('/verifyStudent').get(activateStudent);

router
  .route('/makeApplicationForEnrollment')
  .post(makeApplicationForEnrollment);
router.route('/makeAgreement').post(makeAgreement);
router.route('/makeDataCollection').post(makeDataCollection);

router.route('/makeForm').post(makeFormData);

router.route('/resetPassword').post(generateNumbers);
router.route('/checkNumber').post(checkNumbers);
router.route('/changePassword').post(changePassword);

router.route('/videoUpdate').post(videoUpdate);
router.route('/attempQuiz').post(attempQuiz);
router.route('/getAlldetails').get(getStudentsAggregate);
router.route('/getAlldetailsByTerm/:term').get(getStudentsAggregateByTerm);

router.route('/getAgreementByEmail/:email').get(getAgreementByEmail);
router.route('/getFormByStudent/:studentId').get(getFormDataByStudentId);

router
  .route('/getApplicationEnrollmentByEmail/:email')
  .get(getApplicationForEnrollmentByEmail);

router.route('/getDataCollectionByEmail/:email').get(getDataCollectionByEmail);
router.route('/getBasicInfo/:email').get(getBasicInfo);

router.route('/uploadDocs').post(upload.any('docs'), uploadFiles);

router.route('/').all((req, res) => {
  res.status(200).json({
    message: `Traffic  Server Is Running 🚀🚀 ${process.env.NODE_ENV}`,
  });
});
module.exports = router;
