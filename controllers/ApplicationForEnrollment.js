const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  createApplicationEnrollment,
  getApplicationEnrollmentByEmail,
  // getApplicationEnrollmentById,
  // getApplicationEnrollmentByName,
  approveApplicationEnrollment,
  rejectApplicationEnrollment,
  getApplicationEnrollmentAll,
} = require('../services/ApplicationEnrollment');
const ErrorHandler = require('../utils/errorHandler');

exports.makeApplicationForEnrollment = catchAsyncErrors(
  async (req, res, next) => {
    const {
      studentId,
      name,
      address,
      phoneNum,
      dob,
      socialSociety,
      email,
      EmergancyAddress,
      EmergancyContactName,
      EmergancyPhone,
      EmergancyRelation,
      EducationHighestGradeCompleted,
      MotorLicenseState,
      MotorVehicleLicense,

      applicantSign,
    } = req.body;
    const enrollment = await createApplicationEnrollment({
      studentId,
      name,
      address,
      phoneNum,
      dob,
      socialSociety,
      email,
      EmergancyAddress,
      EmergancyContactName,
      EmergancyPhone,
      EmergancyRelation,
      EducationHighestGradeCompleted,
      MotorLicenseState,
      MotorVehicleLicense,

      applicantSign,
    });
    if (enrollment) {
      res.status(200).json({
        success: true,
        enrollment,
      });
    } else {
      return next(new ErrorHandler('agreement  Not Found', 404));
    }
  }
);

exports.getApplicationsAll = catchAsyncErrors(async (req, res, next) => {
  const agreements = await getApplicationEnrollmentAll();
  res.status(200).json({
    success: true,
    agreements,
  });
});

exports.getApplicationForEnrollmentByName = catchAsyncErrors(
  async (req, res, next) => {}
);
exports.getApplicationForEnrollmentById = catchAsyncErrors(
  async (req, res, next) => {}
);

exports.getApplicationForEnrollmentByEmail = catchAsyncErrors(
  async (req, res, next) => {
    const { email } = req.params;
    const enrollment = await getApplicationEnrollmentByEmail(email);
    if (enrollment) {
      res.status(200).json({
        success: true,
        enrollment,
      });
    } else {
      return next(new ErrorHandler('agreement  Not Found', 404));
    }
  }
);
exports.approveApplicationForEnrollment = catchAsyncErrors(
  async (req, res, next) => {
    const { name, id, student } = req.body;
    const enrollment = await approveApplicationEnrollment({
      adminId: id,
      studentEmail: student,
      adminName: name,
    });
    if (enrollment) {
      res.status(200).json({
        success: true,
        enrollment,
      });
    } else {
      return next(new ErrorHandler('Data Collection  Not Found', 404));
    }
  }
);

exports.rejectApplicationForEnrollment = catchAsyncErrors(
  async (req, res, next) => {
    const { email } = req.body;
    const dataCollected = await rejectApplicationEnrollment({ email });
    if (dataCollected) {
      res.status(200).json({
        success: true,
        dataCollected,
      });
    } else {
      return next(new ErrorHandler('agreement Not Found', 404));
    }
  }
);
