const EnrollmentAgreement = require('../models/EnrollmentAgreement');
const Student = require('../models/Student');

const createEnrollmentAgreement = async ({
  studentId,
  name,
  address,
  phoneNum,
  dob,
  socialSociety,
  email,
  program,
  tranmission,
  constOfTution,
  downPayment,
  thirdPartyPayer,
  weeklyPayments,
  loanPayment,
  applicantSign,
}) => {
  const enrollmentAgreementObj = await EnrollmentAgreement.create({
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email: (email || '').toLowerCase().trim(),
    program,
    tranmission,
    constOfTution,
    downPayment,
    thirdPartyPayer,
    weeklyPayments,
    loanPayment,
    applicantSign,
    dateOfSign: new Date(),
    status: 'PENDING',
  });

  const studentById = await Student.findById(studentId);
  if (studentById) {
    studentById.isAgreement = true;
    await studentById.save();
  }

  return enrollmentAgreementObj;
};

const getEnrollmentAgreementsAll = async () => {
  const agreement = await EnrollmentAgreement.find();
  return agreement;
};

const getEnrollmentAgreementById = async (id) => {
  return await EnrollmentAgreement.findById(id);
};

const getEnrollmentAgreementByName = async (name) => {
  return await EnrollmentAgreement.find({ name });
};

const getEnrollmentAgreementByEmail = async (email) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const agreement = await EnrollmentAgreement.find({
    $or: [{ email: cleanEmail }, { studentId: email }],
  });
  return agreement;
};

const approveEnrollmentAgreement = async ({
  adminId,
  studentEmail,
  adminName,
  constOfTution,
  downPayment,
  thirdPartyPayer,
  weeklyPayments,
  loanPayment,
}) => {
  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const form = await EnrollmentAgreement.find({ email: cleanEmail });
  if (form.length > 0) {
    form[0].constOfTution = constOfTution;
    form[0].downPayment = downPayment;
    form[0].thirdPartyPayer = thirdPartyPayer;
    form[0].weeklyPayments = weeklyPayments;
    form[0].loanPayment = loanPayment;

    form[0].checkedAt = new Date();
    form[0].checkedBy = adminId;
    form[0].checkedByName = adminName;
    form[0].checkedBySign = adminName;
    form[0].status = 'ACCEPTED';

    await Student.findOneAndUpdate(
      { email: cleanEmail },
      {
        $set: {
          isStudent: true,
        },
      }
    );

    await form[0].save();
    return form[0];
  }
  return null;
};

const rejectEnrollmentAgreement = async () => {};

module.exports = {
  createEnrollmentAgreement,
  getEnrollmentAgreementById,
  getEnrollmentAgreementByEmail,
  getEnrollmentAgreementByName,
  approveEnrollmentAgreement,
  rejectEnrollmentAgreement,
  getEnrollmentAgreementsAll,
};
