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
  .route('/api/updateTheIdOfStudentInModules')
  .get(updateTheIdOfStudentInModules);

router
  .route('/api/getAllModulesByStudentId/:studentId')
  .get(getAllChaptersByStudentId);
router
  .route('/api/getChapterByStudentId/:studentId/:chapterNo')
  .get(getChapterByStudentId);

router.route('/api/getAllModules').get(getAllChapters);
router.route('/api/getModule/:chapterId').get(getChapter);
router.route('/api/getQuestionsByModule/:chapterId').get(getChapterQuestion);
router.route('/api/getMyResults/:studentId').get(getResultsOfChapterOfStudent);
router
  .route('/api/getMyResultsChapter/:studentId')
  .get(getResultsOfChapterOfStudentUpdated);

router.route('/api/loginStudent').post(loginStudent);
router.route('/api/createStudent').post(createStudent);
router.route('/api/getAllStudents').get(getStudents);
router.route('/api/getMyInfo/:id').get(getMyInfo);
router.route('/api/verifyStudent').get(activateStudent);

router
  .route('/api/makeApplicationForEnrollment')
  .post(makeApplicationForEnrollment);
router.route('/api/makeAgreement').post(makeAgreement);
router.route('/api/makeDataCollection').post(makeDataCollection);

router.route('/api/makeForm').post(makeFormData);

router.route('/api/resetPassword').post(generateNumbers);
router.route('/api/changePassword').post(changePassword);

router.route('/api/videoUpdate').post(videoUpdate);
router.route('/api/attempQuiz').post(attempQuiz);
router.route('/api/getAlldetails').get(getStudentsAggregate);
router.route('/api/getAlldetailsByTerm/:term').get(getStudentsAggregateByTerm);

router.route('/api/getAgreementByEmail/:email').get(getAgreementByEmail);
router.route('/api/getFormByStudent/:studentId').get(getFormDataByStudentId);

router
  .route('/api/getApplicationEnrollmentByEmail/:email')
  .get(getApplicationForEnrollmentByEmail);

router.route('/api/getDataCollectionByEmail/:email').get(getDataCollectionByEmail);
router.route('/api/getBasicInfo/:email').get(getBasicInfo);

router.route('/api/uploadDocs').post(upload.any('docs'), uploadFiles);

router.route('/api/').all((req, res) => {
  res.status(200).json({
    message: `Traffic  Server Is Running 🚀🚀 ${process.env.NODE_ENV}`,
  });
});
module.exports = router;
