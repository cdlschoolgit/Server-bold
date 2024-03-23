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

router.route('/api/createAdmin').post(createTeacher);
router.route('/api/loginAdmin').post(loginTeacher);
router.route('/api/deleteAdmins').delete(deleteAllTeacherAccount);
router.route('/api/getAdmins').get(getAllTeachers);
router.route('/api/AdminDetails/:id').get(getMyInfo);

// -------------- Changing Student Status
router.route('/api/makeStudentActive').post(makeStudentActive);
router.route('/api/makeStudentInActive').post(makeStudentInActive);
router.route('/api/getBasicInfoById/:id').get(getStudentById);
router.route('/api/changePasswordByAdmin').post(changePasswordByAdmin);
router.route('/api/forcedComplete').post(forcedCompleteByAdmin);

router.route('/api/correctResults').post(makeResultsCorrectByDetails);
router.route('/api/correctResultsById').post(makeResultsCorrectById);

router.route('/api/deleteStudent').post(deleteMyAccountByAdmin);
router.route('/api/deleteStudentByAdmin').post(forcedDeleteByAdmin);

router.route('/api/changeStudentNameByAdmin').post(changeStudentName);
router.route('/api/makeAdminActive').post(makeAdminActive);
router.route('/api/makeAdminInActive').post(makeAdminInActive);
router.route('/api/manageResult').get(manageResultsAndMarks);
router.route('/api/getStudentStatsByMonths').post(getStudentStatsByMonths);
router.route('/api/getStudentStatsByYear').post();
router.route('/api/getCurrentStats').post(getStudentCurrentStatistics);

router.route('/api/getStudentByTerm/:term').get(getStudentByTerm);
router.route('/api/blockStudent').post(blockStudent);
router.route('/api/unBlockStudent').post(unBlockStudent);
router.route('/api/markCompleteStudent').post(markCompleteStudent);
router.route('/api/markInComplete').post(markIncompleteStudent);

router.route('/api/markVerified').post(markVerifiedStudent);
router.route('/api/removeDuplicate').post(removeDuplicateFromResults);

// --------------- Form Handling ----------------------

router.route('/api/approveForm').post(checkForm);

router.route('/api/approveAgreement').post(approveAgreement);
router.route('/api/rejectAgreement').post(rejectAgreement);

router.route('/api/rejectDataCollection').post(rejectDataCollection);
router.route('/api/approveDataCollection').post(approveDataCollection);

router.route('/api/enrollments').post(getApplicationsAll);

router.route('/api/agreement').post(allAgreements);

router.route('/api/forms').get(getAllForms);

router.route('/api/forms/term/:term').get(getAllFormsByTerm);

router.route('/api/forms/:studentId').get(getFormDataByStudentId);

router.route('/api/editForm').post(editForm);

router.route('/api/dataCollected').post(allDataCollected);

router.route('/api/moduleResultSuper').post(getStudentsResultsModuleOnly);

router.route('/api/deleteModuleResultSuper').post(deleteStudentModuleResult);

router
  .route('/api/rejectApplicationForEnrollment')
  .post(rejectApplicationForEnrollment);

router
  .route('/api/approveApplicationForEnrollment')
  .post(approveApplicationForEnrollment);

// ---------------- Requests
// ---------------- Extra Functions ----------------

// router.route("/uploadAssignment").post(upload.single("doc"), uploadFile);
// router.route("/uploadMultiAssignment").post(upload.any("docs"), uploadFiles);

module.exports = router;
