const catchAsyncErrors = require('../middlewares/catchAsyncError');
const EnrollmentAgreement = require('../models/EnrollmentAgreement');
const Student = require('../models/Student');

const createEnrollmentAgreement = catchAsyncErrors(
  async ({
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
      email,
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
    studentById.isAgreement = true;
    // studentById.isStudent = true;
    await studentById.save();

    return enrollmentAgreementObj;
  }
);

const getEnrollmentAgreementsAll = catchAsyncErrors(async () => {
  const agreement = await EnrollmentAgreement.find();
  return agreement;
});

const getEnrollmentAgreementById = catchAsyncErrors(async () => {});
const getEnrollmentAgreementByName = catchAsyncErrors(async () => {});
const getEnrollmentAgreementByEmail = catchAsyncErrors(async (email) => {
  const agreement = await EnrollmentAgreement.find({ studentId: email });
  return agreement;
});
const approveEnrollmentAgreement = catchAsyncErrors(
  async ({
    adminId,
    studentEmail,
    adminName,

    constOfTution,
    downPayment,
    thirdPartyPayer,
    weeklyPayments,
    loanPayment,
  }) => {
    const form = await EnrollmentAgreement.find({ email: studentEmail });
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
        { email: studentEmail },
        {
          $set: {
            isStudent: true,
          },
        }
      );

      await form[0].save();
      return form[0];
    } else return null;
  }
);
const rejectEnrollmentAgreement = catchAsyncErrors(async () => {});
module.exports = {
  createEnrollmentAgreement,
  getEnrollmentAgreementById,
  getEnrollmentAgreementByEmail,
  getEnrollmentAgreementByName,
  approveEnrollmentAgreement,
  rejectEnrollmentAgreement,
  getEnrollmentAgreementsAll,
};
