const notifyEmail = require('../mail/notifyEmail');
const Student = require('../models/Student');
const StudentModuleResult = require('../models/StudentModuleResult');
const StudentResult = require('../models/StudentResult');
const Teacher = require('../models/Teacher');
const logger = require('../utils/logger');
const { makeChaptersData } = require('./Student');
const { createResult } = require('./StudentResult');

const markVerifiedStudentByAdmin = async ({ id, adminId }) => {
  const user = await Student.findById(id);
  const admin = await Teacher.findById(adminId);

  if (!user || !admin) {
    return null;
  }

  user.verified = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  const modulesResults = await StudentModuleResult.find({ studentId: user._id });
  if (!modulesResults || modulesResults.length === 0) {
    await makeChaptersData({ studentId: user._id, studentName: user.name });
  }

  const studentResults = await StudentResult.find({ studentId: user._id });
  if (!studentResults || studentResults.length === 0) {
    await createResult({ studentName: user.name, studentId: user._id });
  }

  await user.save();
  return true;
};

const getStudentStats = async () => {
  const StudentData = await Student.find({}, { createAt: 1, _id: 0 });
  return StudentData;
};

const getStudentStatsYearly = async () => {
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

  if (!stats || stats.length === 0) return [];

  const yearStats = [];
  const currentYearStats = { year: stats[0]._id.year, months: [] };

  stats.forEach((item) => {
    const { year } = item._id;
    const count = item.count;

    if (year === currentYearStats.year) {
      currentYearStats.months.push(count);
    } else {
      yearStats.push({ ...currentYearStats });
      currentYearStats.year = year;
      currentYearStats.months = [count];
    }
  });

  yearStats.push(currentYearStats);
  return yearStats;
};

const markCompleteStudentById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} marked complete student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.completed = true;
    student.completedAt = Date.now();
    await student.save();
  }
  return student;
};

const blockStudentById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} blocked student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.blocked = true;
    await student.save();
  }
  return student;
};

const unBlockStudentById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} unblocked student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.blocked = false;
    await student.save();
  }
  return student;
};

const markIncompleteStudentById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} marked incomplete student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.completed = false;
    await student.save();
  }
  return student;
};

const makeStudentActiveById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} activated student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.active = true;
    await student.save();
  }
  return student;
};

const makeStudentInActiveById = async ({ studentId, teacherId }) => {
  logger.info(`${teacherId} deactivated student ${studentId}`);
  const student = await Student.findById(studentId);
  if (student) {
    student.active = false;
    await student.save();
  }
  return student;
};

const deleteTeacherAccountById = async (id) => {
  const deleted = await Teacher.findByIdAndDelete(id);
  return deleted;
};

const deleteTeacherAccounts = async () => {
  await Teacher.deleteMany({});
};

const getAllTeacher = async () => {
  const teachers = await Teacher.find({ super: false });
  return teachers;
};

const changePasswordByAdminForced = async ({ studentId, password, adminId }) => {
  const admin = await Teacher.findById(adminId);
  if (admin) {
    const student = await Student.findById(studentId);
    if (student) {
      student.password = password;
      await student.save();
      return true;
    }
  }
  return null;
};

const createTeacherWithDetails = async (name, email, password) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const teacherCreated = await Teacher.create({ name, email: cleanEmail, password });
  await notifyEmail({
    name,
    password,
    email: cleanEmail,
    subject: 'Admin Account Created - United CDL School',
  });
  return teacherCreated;
};

const loginTeacher = async (email, password) => {
  if (!email || !password) return null;
  const cleanEmail = email.toLowerCase().trim();
  const teacher = await Teacher.findOne({ email: cleanEmail }).select('+password');

  if (!teacher) {
    return null;
  }

  if (teacher.password !== password) {
    return null;
  }

  return teacher;
};

const getTeacherByID = async (id) => {
  const teacher = await Teacher.findById(id);
  return teacher;
};

const makeAdminActive = async (adminId) => {
  const teacher = await Teacher.findById(adminId);
  if (teacher) {
    teacher.active = true;
    await teacher.save();
  }
  return teacher;
};

const makeAdminInActive = async (id) => {
  const teacher = await Teacher.findById(id);
  if (teacher) {
    teacher.active = false;
    await teacher.save();
  }
  return teacher;
};

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
