const catchAsyncErrors = require('../middlewares/catchAsyncError');

const {
  loginStudent,
  createStudentWithDetails,
  getAllStudents,
  deleteStudentAccountById,
  deleteStudentAccounts,
  getStudentByID,
  activateStudentByEmail,
  uploadMultiAssignments,
  studensWithResults,
  checkNumbersStudent,
  changePasswordStudent,
  generateNumersStudent,
  studensWithTermResults,
  changeStudentNameByAdmin,
  getStudentStatistics,
} = require('../services/Student');
const {
  calculateResult,
  // getStudentResults,
  manageResultAndUpdate,
  removeDuplicate,
  studentModuleResultsOnly,
  deleteStudentModuleResult,
} = require('../services/StudentResult');
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { password, email, code } = req.body;
  const result = await changePasswordStudent({ password, email, code });
  if (result)
    res.status(200).json({
      success: true,
      message: 'Password Changed',
    });
  else {
    res.status(404).json({
      success: true,
      message: 'Code is Incorrect',
    });
  }
});
exports.checkNumbers = catchAsyncErrors(async (req, res, next) => {
  const { email, code } = req.body;
  const result = await checkNumbersStudent({ email, code });
  if (result)
    res.status(200).json({
      success: true,
      message: 'Code is verified please Change the password ',
    });
  else {
    res.status(404).json({
      success: true,
      message: 'Code is Incorrect',
    });
  }
});
exports.generateNumbers = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  // console.log("in email");
  const result = await generateNumersStudent({ email });
  if (result)
    res.status(200).json({
      success: true,
      message: 'email has been sent, please check and enter number',
    });
  else {
    res.status(404).json({
      success: true,
      message: 'Email Not Found',
    });
  }
});

exports.uploadFiles = catchAsyncErrors(async (req, res, next) => {
  const result = await uploadMultiAssignments(req);
  if (result) {
    res.status(200).json({
      success: true,
      message: 'more than one file Uploading Api',
    });
  } else {
    return next(new ErrorHandler('Error in Uploading Assignment', 400));
  }
});

exports.getStudentsAggregateByTerm = catchAsyncErrors(
  async (req, res, next) => {
    const { term } = req.params;
    const students = await studensWithTermResults({ term });
    res.status(200).json({
      success: true,
      students,
    });
  }
);

exports.getStudentsAggregate = catchAsyncErrors(async (req, res, next) => {
  const students = await studensWithResults();
  res.status(200).json({
    success: true,
    students,
  });
});
exports.removeDuplicateFromResults = catchAsyncErrors(
  async (req, res, next) => {
    const { studentName } = req.body;
    const result = await removeDuplicate({ studentName });
    res.status(200).json({
      success: true,
      result,
    });
  }
);

exports.manageResultsAndMarks = catchAsyncErrors(async (req, res, next) => {
  const result = await manageResultAndUpdate();
  res.status(200).json({
    success: true,
    result,
  });
});

exports.attempQuiz = catchAsyncErrors(async (req, res, next) => {
  const { studentId, questions, moduleName, moduleNo } = req.body;
  const result = await calculateResult({
    studentId,
    questions,
    moduleName,
    moduleNo,
  });
  // failed // passed
  res.status(200).json({
    success: true,
    message: 'Quiz Attempted',
    result,
  });
});
exports.activateStudent = catchAsyncErrors(async (req, res, next) => {
  const { token, email, name } = req.query;
  console.log("verifying")
  const result = await activateStudentByEmail(token, email, name);
  if (result === 'tokenExpired') {
    res.redirect(`https://www.unitedcdleldt.com/tokenExpired`);
    // res.status(400).json({
    //   success: false,
    //   message: "Token Expired",
    // });
  } else if (result === 'approved') {
    // have to replace with redirect
    res.redirect(`https://www.unitedcdleldt.com/student/Login`);
    // res.status(200).json({
    //   success: true,
    //   message: "Account has been Approved",
    // });
  } else {
    res.redirect(`https://www.unitedcdleldt.com/${email}`);
    // res.status(404).json({
    //   success: false,
    //   message: "User Not Found",
    // });
  }
});

const ErrorHandler = require('../utils/errorHandler');

exports.getStudents = catchAsyncErrors(async (req, res, next) => {
  const students = await getAllStudents();
  res.status(200).json({
    success: true,
    students,
  });
});

exports.deleteStudentModuleResult = catchAsyncErrors(async (req, res, next) => {
  const results = await deleteStudentModuleResult({ id: req.body.id });
  res.status(200).json({
    success: true,
    results,
  });
});

exports.getStudentsResultsModuleOnly = catchAsyncErrors(
  async (req, res, next) => {
    const results = await studentModuleResultsOnly({
      studentId: req.body.studentId,
    });
    res.status(200).json({
      success: true,
      results,
    });
  }
);

exports.createStudent = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (email === undefined || password === undefined || name === undefined) {
    return next(
      new ErrorHandler('Please Enter a valid email address and password', 400)
    );
  }
  const student = await createStudentWithDetails(
    name,
    email?.toLowerCase(),
    password
  );
  if (student) {
    res.status(200).json({
      success: true,
      student,
    });
  } else {
    return next(new ErrorHandler('Error In creating new User', 400));
  }
});
exports.deleteAllStudentAccount = catchAsyncErrors(async (req, res, next) => {
  await deleteStudentAccounts();
  res.status(200).json({
    success: true,
    message: 'deleted Students',
  });
});

exports.getStudentCurrentStatistics = catchAsyncErrors(
  async (req, res, next) => {
    const stats = await getStudentStatistics();
    res.status(200).json({
      success: true,
      stats,
    });
  }
);

exports.changeStudentName = catchAsyncErrors(async (req, res, next) => {
  const { newName, id } = req.body;

  const result = await changeStudentNameByAdmin(id, newName);
  if (result == null) {
    return next(new ErrorHandler('Account Not Found', 404));
  } else
    res.status(200).json({
      success: true,
      message: 'name has been updated',
      result,
    });
});

exports.deleteMyAccountByAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id, password } = req.body;
  if (password !== 'password@1')
    return next(new ErrorHandler('Access denied', 404));
  const result = await deleteStudentAccountById(id);
  if (result == null) {
    return next(new ErrorHandler('Account Not Found', 404));
  } else
    res.status(200).json({
      success: true,
      message: 'account has been deleted',
      result,
    });
});
exports.getMyInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const student = await getStudentByID(id);
  if (student == null) {
    return next(new ErrorHandler('Incorrent username or password', 400));
  } else {
    res.status(200).json({
      success: true,
      user: student,
    });
  }
});
exports.loginStudent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler('Please Enter a valid email address and password', 400)
    );
  }
  const student = await loginStudent(email, password);
  if (student == null) {
    return next(new ErrorHandler('Incorrent username or password', 400));
  } else if (!student?.verified) {
    return next(
      new ErrorHandler(
        'Dear Trainee, Please open your email and verify yourself ',
        400
      )
    );
  } else if (student?.blocked) {
    return next(new ErrorHandler('Your Account is Freezed By Admin', 400));
  } else
    res.status(200).json({
      success: true,
      user: student,
    });
});
