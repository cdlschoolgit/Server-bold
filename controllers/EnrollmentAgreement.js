const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  createEnrollmentAgreement,
  getEnrollmentAgreementByEmail,
  rejectEnrollmentAgreement,
  approveEnrollmentAgreement,
  getEnrollmentAgreementsAll,
} = require('../services/EnrollmentAgreement');
const {
  makeResultsCorrect,
  makeResultsCorrectById,
} = require('../services/StudentResult');
const ErrorHandler = require('../utils/errorHandler');

exports.makeResultsCorrectById = catchAsyncErrors(async (req, res, next) => {
  const { studentId } = req.body;
  if (!studentId) {
    throw new ErrorHandler('Please Enter the Name of Student', 400);
  }
  const result = await makeResultsCorrectById({ studentId });
  if (result) {
    res.status(200).json({
      success: true,
      message: 'updated',
    });
  } else {
    throw new ErrorHandler('Please Enter the Name of Student', 400);
  }
});

exports.makeResultsCorrectByDetails = catchAsyncErrors(
  async (req, res, next) => {
    const { studentName } = req.body;
    if (!studentName) {
      throw new ErrorHandler('Please Enter the Name of Student', 400);
    }
    const result = await makeResultsCorrect({ studentName });
    if (result) {
      res.status(200).json({
        success: true,
        message: 'updated',
      });
    } else {
      throw new ErrorHandler('Please Enter the Name of Student', 400);
    }
  }
);

exports.makeAgreement = catchAsyncErrors(async (req, res, next) => {
  const {
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
  } = req.body;
  const agreement = await createEnrollmentAgreement({
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
  });
  if (agreement) {
    res.status(200).json({
      success: true,
      agreement,
    });
  } else {
    return next(new ErrorHandler('Agreement creation error', 404));
  }
});
exports.getAgreementByName = catchAsyncErrors(async (req, res, next) => {});
exports.getAgreementById = catchAsyncErrors(async (req, res, next) => {});

exports.getAgreementByEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;
  const agreement = await getEnrollmentAgreementByEmail(email);
  if (agreement) {
    res.status(200).json({
      success: true,
      agreement,
    });
  } else {
    return next(new ErrorHandler('agreement  Not Found', 404));
  }
});
exports.approveAgreement = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    id,
    student,
    constOfTution,
    downPayment,
    thirdPartyPayer,
    weeklyPayments,
    loanPayment,
  } = req.body;
  const dataCollected = await approveEnrollmentAgreement({
    adminId: id,
    studentEmail: student,
    adminName: name,

    constOfTution,
    downPayment,
    thirdPartyPayer,
    weeklyPayments,
    loanPayment,
  });
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('Data Collection  Not Found', 404));
  }
});
exports.allAgreements = catchAsyncErrors(async (req, res, next) => {
  const agreements = await getEnrollmentAgreementsAll();
  res.status(200).json({
    success: true,
    agreements,
  });
});

exports.rejectAgreement = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const dataCollected = await rejectEnrollmentAgreement({ email });
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('agreement Not Found', 404));
  }
});
