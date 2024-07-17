const catchAsyncErrors = require('../middlewares/catchAsyncError');
// const { getCoursesByTeacherId } = require('../services/Course');
const { getStudentByID, getStudentsByTerm } = require('../services/Student');
const { forcedComplete, forcedDelete } = require('../services/StudentResult');
const {
  getTeacherByID,
  getAllTeacher,
  loginTeacher,
  createTeacherWithDetails,
  deleteTeacherAccounts,
  deleteTeacherAccountById,
  makeStudentActiveById,
  makeStudentInActiveById,

  markCompleteStudentById,
  blockStudentById,
  markIncompleteStudentById,
  unBlockStudentById,
  getStudentStats,
  makeAdminActive,
  makeAdminInActive,
  changePasswordByAdminForced,
  markVerifiedStudentByAdmin,
  getStudentStatsYearly,
} = require('../services/Teacher');
const ErrorHandler = require('../utils/errorHandler');
exports.forcedCompleteByAdmin = catchAsyncErrors(async (req, res) => {
  const { adminCode, admin, studentId, studentName } = req.body;
  const result = await forcedComplete({
    studentName,
    studentId,
    adminId: admin,
    adminPassword: adminCode,
  });
  if (result)
    res.status(200).json({ success: true, message: 'Forced Completed' });
  else res.status(400).json({ success: false, message: 'Completion Failed' });
});

exports.forcedDeleteByAdmin = catchAsyncErrors(async (req, res) => {
  const { adminCode, admin, studentId } = req.body;
  const result = await forcedDelete({
    studentId,
    adminId: admin,
    adminPassword: adminCode,
  });
  if (result)
    res.status(200).json({ success: true, message: 'Forced Completed' });
  else res.status(400).json({ success: false, message: 'Completion Failed' });
});

exports.getStudentByTerm = catchAsyncErrors(async (req, res) => {
  const { term } = req.params;
  const students = await getStudentsByTerm({ term });
  res.status(200).json({
    success: true,
    students,
  });
});

exports.changePasswordByAdmin = catchAsyncErrors(async (req, res) => {
  const { studentId, password, adminId } = req.body;
  const result = await changePasswordByAdminForced({
    studentId,
    password,
    adminId,
  });
  if (result)
    res
      .status(200)
      .json({ success: true, message: 'Student Password Changed' });
  else
    res
      .status(400)
      .json({ success: false, message: 'Error in Changing Password' });
});

exports.markVerifiedStudent = catchAsyncErrors(async (req, res, next) => {
  const { id, adminId } = req.body;
  const result = await markVerifiedStudentByAdmin({ id, adminId });
  if (result)
    res.status(200).json({ success: true, message: 'Student is Acivitated' });
  else res.status(400).json({ success: false, message: 'error in Activation' });
});

exports.getStudentById = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const data = await getStudentByID(id);
  if (data) res.status(200).json({ success: true, user: data });
  else res.status(400).json({ success: false, message: 'error' });
});

exports.makeAdminActive = catchAsyncErrors(async (req, res, next) => {
  const { adminId, superAdminId } = req.body;
  const data = await makeAdminActive(adminId, superAdminId);
  if (data)
    res.status(200).json({ success: true, message: 'Admin is Acivitated' });
  else res.status(400).json({ success: false, message: 'error' });
});
exports.makeAdminInActive = catchAsyncErrors(async (req, res, next) => {
  const { adminId, superAdminId } = req.body;
  const data = await makeAdminInActive(adminId, superAdminId);
  if (data)
    res.status(200).json({ success: true, message: 'Admin is InAcivitated' });
  else res.status(400).json({ success: false, message: 'error' });
});

exports.getStudentStatsByMonthsAndYearly = catchAsyncErrors(
  async (req, res, next) => {
    const stats = await getStudentStatsYearly();
    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);

exports.getStudentStatsByMonths = catchAsyncErrors(async (req, res, next) => {
  const data = await getStudentStats();
  res.status(200).json({
    success: true,
    data,
  });
});

exports.blockStudent = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await blockStudentById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been blocked',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});
exports.unBlockStudent = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await unBlockStudentById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been unblocked',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});
exports.markCompleteStudent = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await markCompleteStudentById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been marked Completed',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});
exports.markIncompleteStudent = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await markIncompleteStudentById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been marked Incompleted',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});

exports.makeStudentInActive = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await makeStudentInActiveById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been Verified',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});
exports.makeStudentActive = catchAsyncErrors(async (req, res, next) => {
  const { studentId, teacherId } = req.body;
  const student = await makeStudentActiveById({ studentId, teacherId });
  if (student) {
    res.status(200).json({
      success: true,
      message: 'Student Has been Verified',
    });
  } else {
    return next(new ErrorHandler('student Not Found', 404));
  }
});

exports.getAllTeachers = catchAsyncErrors(async (req, res, next) => {
  const teachers = await getAllTeacher();
  res.status(200).json({
    success: true,
    teachers,
  });
});
exports.createTeacher = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (email === undefined || password === undefined || name === undefined) {
    return next(
      new ErrorHandler('Please Enter a valid email address and password', 400)
    );
  }
  const teacher = await createTeacherWithDetails(name, email, password);
  if (teacher == null) {
    return next(new ErrorHandler('Error in creating User', 400));
  } else {
    res.status(200).json({
      success: true,
      teacher,
    });
  }
});
exports.getMyInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const student = await getTeacherByID(id);
  if (student == null) {
    return next(new ErrorHandler('Incorrent username or password', 400));
  } else {
    res.status(200).json({
      success: true,
      user: student,
    });
  }
});
exports.deleteAllTeacherAccount = catchAsyncErrors(async (req, res, next) => {
  await deleteTeacherAccounts();
  res.status(200).json({
    success: true,
    message: ' deleted teachers',
  });
});

exports.deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const result = await deleteTeacherAccountById(id);
  if (result == null) {
    return next(new ErrorHandler('Account Not Found', 404));
  } else
    res.status(200).json({
      success: true,
    });
});



exports.loginTeacher = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter a valid email address and password', 400));
  }

  console.log(`Attempting login for email: ${email}`);

  const user = await loginTeacher(email, password);

  if (!user) {
    console.log(`Login failed for email: ${email}`);
    return next(new ErrorHandler('Incorrect username or password', 400));
  }

  console.log(`Login successful for email: ${email}`);

  res.status(200).json({
    success: true,
    user,
  });
});