const ApplicationEnrollment = require('../models/ApplicationForEnrollment');
const Student = require('../models/Student');

const createApplicationEnrollment = async ({
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
    email: (email || '').toLowerCase().trim(),
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
  if (studentById) {
    studentById.isEnrolled = true;
    await studentById.save();
  }

  return applicationEnrollmentObj;
};

const getApplicationEnrollmentById = async (id) => {
  return await ApplicationEnrollment.findById(id);
};

const getApplicationEnrollmentByName = async (name) => {
  return await ApplicationEnrollment.find({ name });
};

const getApplicationEnrollmentByEmail = async (email) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const application = await ApplicationEnrollment.find({
    $or: [{ email: cleanEmail }, { studentId: email }],
  });
  return application;
};

const getApplicationEnrollmentAll = async () => {
  const application = await ApplicationEnrollment.find();
  return application;
};

const approveApplicationEnrollment = async ({ adminId, studentEmail, adminName }) => {
  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const form = await ApplicationEnrollment.find({ email: cleanEmail });
  if (form.length > 0) {
    form[0].checkedAt = new Date();
    form[0].checkedBy = adminId;
    form[0].checkedByName = adminName;
    form[0].checkedBySign = adminName;
    form[0].status = 'ACCEPTED';
    await form[0].save();
    return form[0];
  }
  return null;
};

const rejectApplicationEnrollment = async () => {};

module.exports = {
  createApplicationEnrollment,
  getApplicationEnrollmentById,
  getApplicationEnrollmentByEmail,
  getApplicationEnrollmentByName,
  approveApplicationEnrollment,
  rejectApplicationEnrollment,
  getApplicationEnrollmentAll,
};
