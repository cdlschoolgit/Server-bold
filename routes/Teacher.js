const express = require('express');
const multer = require('multer');
const {
  rejectApplicationForEnrollment,
  approveApplicationForEnrollment,
  getApplicationsAll,
} = require('../controllers/ApplicationForEnrollment');
const {
  rejectDataCollection,
  approveDataCollection,
  allDataCollected,
} = require('../controllers/DataCollectionForm');
const {
  rejectAgreement,
  approveAgreement,
  allAgreements,
  makeResultsCorrectByDetails,
  makeResultsCorrectById,
} = require('../controllers/EnrollmentAgreement');
// ---------- Import Functions
const {
  createTeacher,
  loginTeacher,
  getMyInfo,
  deleteAllTeacherAccount,
  getAllTeachers,
  makeStudentActive,
  blockStudent,
  unBlockStudent,
  markCompleteStudent,
  markIncompleteStudent,
  makeStudentInActive,
  getStudentStatsByMonths,
  makeAdminActive,
  makeAdminInActive,
  getStudentById,
  markVerifiedStudent,
  changePasswordByAdmin,
  getStudentByTerm,
  forcedCompleteByAdmin,
  forcedDeleteByAdmin,
  getStudentStatsByMonthsAndYearly,
} = require('../controllers/Teacher');
const {
  manageResultsAndMarks,
  removeDuplicateFromResults,
  getStudentsResultsModuleOnly,
  deleteStudentModuleResult,
  deleteMyAccountByAdmin,
  changeStudentName,
  getStudentCurrentStatistics,
} = require('../controllers/Student');
const {
  checkForm,
  getAllForms,
  editForm,
  getFormDataByStudentId,
  getAllFormsByTerm,
} = require('../controllers/Form');

// ---------------- Multer Stoarge
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ---------------- Router ----------------

const router = express.Router();

// ---------------- Functions ----------------

router.route('/createAdmin').post(createTeacher);
router.route('/loginAdmin').post(loginTeacher);
router.route('/deleteAdmins').delete(deleteAllTeacherAccount);
router.route('/getAdmins').get(getAllTeachers);
router.route('/AdminDetails/:id').get(getMyInfo);

// -------------- Changing Student Status
router.route('/makeStudentActive').post(makeStudentActive);
router.route('/makeStudentInActive').post(makeStudentInActive);
router.route('/getBasicInfoById/:id').get(getStudentById);
router.route('/changePasswordByAdmin').post(changePasswordByAdmin);
router.route('/forcedComplete').post(forcedCompleteByAdmin);

router.route('/correctResults').post(makeResultsCorrectByDetails);
router.route('/correctResultsById').post(makeResultsCorrectById);

router.route('/deleteStudent').post(deleteMyAccountByAdmin);
router.route('/deleteStudentByAdmin').post(forcedDeleteByAdmin);

router.route('/changeStudentNameByAdmin').post(changeStudentName);
router.route('/makeAdminActive').post(makeAdminActive);
router.route('/makeAdminInActive').post(makeAdminInActive);
router.route('/manageResult').get(manageResultsAndMarks);
router.route('/getStudentStatsByMonths').post(getStudentStatsByMonths);
router.route('/getStudentStatsByYear').post();
router.route('/getCurrentStats').post(getStudentCurrentStatistics);

router.route('/getStudentByTerm/:term').get(getStudentByTerm);
router.route('/blockStudent').post(blockStudent);
router.route('/unBlockStudent').post(unBlockStudent);
router.route('/markCompleteStudent').post(markCompleteStudent);
router.route('/markInComplete').post(markIncompleteStudent);

router.route('/markVerified').post(markVerifiedStudent);
router.route('/removeDuplicate').post(removeDuplicateFromResults);

// --------------- Form Handling ----------------------

router.route('/approveForm').post(checkForm);

router.route('/approveAgreement').post(approveAgreement);
router.route('/rejectAgreement').post(rejectAgreement);

router.route('/rejectDataCollection').post(rejectDataCollection);
router.route('/approveDataCollection').post(approveDataCollection);

router.route('/enrollments').post(getApplicationsAll);

router.route('/agreement').post(allAgreements);

router.route('/forms').get(getAllForms);

router.route('/forms/term/:term').get(getAllFormsByTerm);

router.route('/forms/:studentId').get(getFormDataByStudentId);

router.route('/editForm').post(editForm);

router.route('/dataCollected').post(allDataCollected);

router.route('/moduleResultSuper').post(getStudentsResultsModuleOnly);

router.route('/deleteModuleResultSuper').post(deleteStudentModuleResult);

router
  .route('/rejectApplicationForEnrollment')
  .post(rejectApplicationForEnrollment);

router
  .route('/approveApplicationForEnrollment')
  .post(approveApplicationForEnrollment);

// ---------------- Requests
// ---------------- Extra Functions ----------------

// router.route("/uploadAssignment").post(upload.single("doc"), uploadFile);
// router.route("/uploadMultiAssignment").post(upload.any("docs"), uploadFiles);

module.exports = router;
