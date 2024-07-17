const notifyEmail = require('../mail/notifyEmail');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const Student = require('../models/Student');
const StudentModuleResult = require('../models/StudentModuleResult');
const StudentResult = require('../models/StudentResult');
const Teacher = require('../models/Teacher');
const logger = require('../utils/logger');
const { makeChaptersData } = require('./Student');
const { createResult } = require('./StudentResult');

const markVerifiedStudentByAdmin = catchAsyncErrors(async ({ id, adminId }) => {
  const user = await Student.findById(id);
  const admin = await Teacher.findById(adminId);

  if (!user || !admin) {
    return null;
  } else {
    user.verified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    const modulesResults = await StudentModuleResult.find({
      studentName: user.name,
    });

    const studentResults = await StudentResult.find({ studentName: user.name });
    if (modulesResults.length === 0)
      await makeChaptersData({ studentId: user?._id, studentName: user.name });
    if (studentResults.length == 0)
      await createResult({ studentName: user.name, studentId: user?._id });

    await user.save();

    return true;
  }
});

const getStudentStats = catchAsyncErrors(async () => {
  const StudentData = await Student.find({}, { createAt: 1, _id: 0 });
  return StudentData;
});
const getStudentStatsYearly = catchAsyncErrors(async () => {
  const stats = await Student.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createAt' },
          month: { $month: '$createAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  // Prepare the data for the bar chart
  const yearStats = [];
  const currentYearStats = { year: stats[0]._id.year, months: [] };

  stats.forEach((item) => {
    const {
      year,
      //  month
    } = item._id;
    const count = item.count;

    if (year === currentYearStats.year) {
      currentYearStats.months.push(count);
    } else {
      yearStats.push(currentYearStats);
      currentYearStats.year = year;
      currentYearStats.months = [count];
    }
  });

  yearStats.push(currentYearStats);

  return yearStats;
});

const markCompleteStudentById = catchAsyncErrors(
  async ({ studentId, teacherId }) => {
    logger.info(` ${teacherId} has marked compelted student ${studentId}`);
    const student = await Student.findById(studentId);
    student.completed = true;
    await student.save();
    return student;
  }
);
const blockStudentById = catchAsyncErrors(async ({ studentId, teacherId }) => {
  logger.info(` ${teacherId} has marked blocked student ${studentId}`);
  const student = await Student.findById(studentId);
  student.blocked = true;
  await student.save();
  return student;
});
const unBlockStudentById = catchAsyncErrors(
  async ({ studentId, teacherId }) => {
    logger.info(` ${teacherId} has marked Unblocked student ${studentId}`);
    const student = await Student.findById(studentId);
    student.blocked = false;
    await student.save();
    return student;
  }
);
const markIncompleteStudentById = catchAsyncErrors(
  async ({ studentId, teacherId }) => {
    logger.info(` ${teacherId} has marked InComplete student ${studentId}`);
    const student = await Student.findById(studentId);
    student.completed = false;
    await student.save();
    return student;
  }
);

const makeStudentActiveById = catchAsyncErrors(
  async ({ studentId, teacherId }) => {
    logger.info(` ${teacherId} has activated student ${studentId}`);
    const student = await Student.findById(studentId);
    student.active = true;

    await student.save();
    return student;
  }
);
const makeStudentInActiveById = catchAsyncErrors(
  async ({ studentId, teacherId }) => {
    logger.info(` ${teacherId} has activated student ${studentId}`);
    const student = await Student.findById(studentId);
    student.active = false;
    await student.save();
    return student;
  }
);

const deleteTeacherAccountById = catchAsyncErrors(async (id) => {
  const deleted = await Teacher.findByIdAndDelete(id);
  return deleted;
});
const deleteTeacherAccounts = catchAsyncErrors(async () => {
  await Teacher.deleteMany({});
  return;
});
const getAllTeacher = catchAsyncErrors(async () => {
  const teachers = await Teacher.find({ super: false });
  return teachers;
});

const changePasswordByAdminForced = catchAsyncErrors(
  async ({ studentId, password, adminId }) => {
    const admin = await Teacher.findById(adminId);
    if (admin !== undefined) {
      const student = await Student.findById(studentId);
      if (student !== undefined) {
        student.password = password;
        await student.save();
        return true;
      } else return null;
    } else return null;
  }
);

const createTeacherWithDetails = catchAsyncErrors(
  async (name, email, password) => {
    const teacherCreated = await Teacher.create({ name, email, password });
    notifyEmail({
      name,
      password,
      email,
      subject: 'Admin Notification Email',
    });

    return teacherCreated;
  }
);
const loginTeacher = async (email, password) => {
  const teacher = await Teacher.findOne({ email }).select('+password');

  if (!teacher) {
    console.log('Teacher not found');
    return null;
  }

  if (teacher.password !== password) {
    console.log('Password mismatch');
    return null;
  }

  return teacher;
};
const getTeacherByID = catchAsyncErrors(async (id) => {
  const teacher = await Teacher.findById(id);
  return teacher;
});

const makeAdminActive = catchAsyncErrors(async (adminId) => {
  const teacher = await Teacher.findById(adminId);
  teacher.active = true;
  await teacher.save();
  return teacher;
});
const makeAdminInActive = catchAsyncErrors(async (id) => {
  const teacher = await Teacher.findById(id);
  teacher.active = false;
  await teacher.save();
  return teacher;
});

// function checkIsEnrolled(enrollments, studentId) {
//   const enrolled = enrollments.filter((item) => item == studentId);
//   if (enrolled.length > 0) {
//     return true;
//   }
//   return false;
// }

module.exports = {
  loginTeacher,
  makeStudentActiveById,
  getTeacherByID,
  createTeacherWithDetails,
  getAllTeacher,
  deleteTeacherAccountById,
  deleteTeacherAccounts,

  makeAdminActive,
  makeAdminInActive,
  makeStudentInActiveById,
  markCompleteStudentById,
  blockStudentById,
  markIncompleteStudentById,
  unBlockStudentById,
  getStudentStats,
  markVerifiedStudentByAdmin,
  changePasswordByAdminForced,
  getStudentStatsYearly,
};
