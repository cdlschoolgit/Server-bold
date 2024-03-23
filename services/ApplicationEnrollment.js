const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ApplicationEnrollment = require('../models/ApplicationForEnrollment');
const Student = require('../models/Student');

const createApplicationEnrollment = catchAsyncErrors(
  async ({
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
  }) => {
    const applicationEnrollmentObj = await ApplicationEnrollment.create({
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

      status: 'PENDING',
      dateOfSign: new Date(),
    });

    const studentById = await Student.findById(studentId);
    studentById.isEnrolled = true;
    await studentById.save();

    return applicationEnrollmentObj;
  }
);
const getApplicationEnrollmentById = catchAsyncErrors(async (id) => {});
const getApplicationEnrollmentByName = catchAsyncErrors(async (name) => {});
const getApplicationEnrollmentByEmail = catchAsyncErrors(async (email) => {
  const application = await ApplicationEnrollment.find({ studentId: email });
  return application;
});
const getApplicationEnrollmentAll = catchAsyncErrors(async (email) => {
  const application = await ApplicationEnrollment.find();
  return application;
});

const approveApplicationEnrollment = catchAsyncErrors(
  async ({ adminId, studentEmail, adminName }) => {
    const form = await ApplicationEnrollment.find({ email: studentEmail });
    if (form.length > 0) {
      form[0].checkedAt = new Date();
      form[0].checkedBy = adminId;
      form[0].checkedByName = adminName;
      form[0].checkedBySign = adminName;
      form[0].status = 'ACCEPTED';
      await form[0].save();
      return form[0];
    } else return null;
  }
);
const rejectApplicationEnrollment = catchAsyncErrors(async () => {});
module.exports = {
  createApplicationEnrollment,
  getApplicationEnrollmentById,
  getApplicationEnrollmentByEmail,
  getApplicationEnrollmentByName,
  approveApplicationEnrollment,
  rejectApplicationEnrollment,
  getApplicationEnrollmentAll,
};
