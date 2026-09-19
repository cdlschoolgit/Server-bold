const Student = require('../models/Student');
const crypto = require('crypto');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../aws/awsConfig');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sendEmail = require('../mail/sendEmail');
const { createResult } = require('./StudentResult');
const pinCodeEmail = require('../mail/pinCodeEmail');
const StudentModuleResult = require('../models/StudentModuleResult');
const chaptersData = require('../data/chapters.json');
const logger = require('../utils/logger');
const StudentResult = require('../models/StudentResult');
const Form = require('../models/Form');
const bucketName = process.env.BUCKET_NAME || 'united-cdl-school';

const changePasswordStudent = async ({ password, email, code }) => {
  if (!email || !code || !password) return null;
  const cleanEmail = email.toLowerCase().trim();

  const studentFound = await Student.findOne({
    email: cleanEmail,
    resetPasswordToken: String(code),
  });

  if (studentFound) {
    studentFound.resetPasswordExpire = undefined;
    studentFound.resetPasswordToken = undefined;
    studentFound.password = password;
    await studentFound.save();
    return true;
  }
  return null;
};

const getChaptersByStudentId = async ({ studentId }) => {
  let chapters = await StudentModuleResult.find({ studentId }).sort({ chapterNo: 1 });
  if (!chapters || chapters.length === 0) {
    const student = await Student.findById(studentId);
    if (student) {
      await makeChaptersData({ studentId: student._id, studentName: student.name });
      chapters = await StudentModuleResult.find({ studentId }).sort({ chapterNo: 1 });
    }
  }

  // Calculate sequential unlock/lock state
  let allPreviousPassed = true;
  const enriched = chapters.map((ch, idx) => {
    const item = ch.toObject ? ch.toObject() : { ...ch };
    const isPassed = item.status === 'PASSED' || (Number(item.percentage) >= 0.8);

    if (idx === 0) {
      // Module 1 is always unlocked
      item.isLocked = false;
    } else {
      // Module N is locked if any preceding module is not passed
      item.isLocked = !allPreviousPassed;
    }

    if (!isPassed) {
      allPreviousPassed = false;
    }
    return item;
  });

  return enriched;
};

const getChapterByStudentIdAndChapterId = async ({ studentId, chapterNo }) => {
  const modNo = Number(chapterNo);
  let chapter = await StudentModuleResult.findOne({ studentId, chapterNo: modNo });
  if (!chapter) {
    const student = await Student.findById(studentId);
    if (student) {
      await makeChaptersData({ studentId: student._id, studentName: student.name });
      chapter = await StudentModuleResult.findOne({ studentId, chapterNo: modNo });
    }
  }

  if (!chapter) return null;

  const item = chapter.toObject ? chapter.toObject() : { ...chapter };
  if (modNo === 1) {
    item.isLocked = false;
  } else {
    // Check if previous module was passed
    const prevModule = await StudentModuleResult.findOne({ studentId, chapterNo: modNo - 1 });
    item.isLocked = !prevModule || (prevModule.status !== 'PASSED' && (Number(prevModule.percentage) || 0) < 0.8);
  }

  return item;
};

const makeChaptersData = async ({ studentId, studentName }) => {
  const existing = await StudentModuleResult.find({ studentId });
  if (existing && existing.length >= 35) return existing;

  const total = Math.min(35, chaptersData.length);
  for (let i = 0; i < total; i++) {
    const chapterNo = chaptersData[i].customIndex || (i + 1);
    const existingChapter = await StudentModuleResult.findOne({ studentId, chapterNo });
    if (!existingChapter) {
      await StudentModuleResult.create({
        studentName: studentName,
        studentId: studentId,
        chapterNo: chapterNo,
        chapterName: chaptersData[i].name,
        videoPlayed: 0,
        percentage: 0,
        marks: 0,
        attempted: false,
        status: 'NOT_ATTEMPTED',
      });
    }
  }
  return await StudentModuleResult.find({ studentId }).sort({ chapterNo: 1 });
};

const activateStudentByEmail = async (token, email, name) => {
  if (!email) return 'tokenExpired';
  const cleanEmail = email.toLowerCase().trim();

  // If already verified, allow login immediately
  const existingStudent = await Student.findOne({ email: cleanEmail });
  if (existingStudent && existingStudent.verified) {
    const modulesResults = await StudentModuleResult.find({ studentId: existingStudent._id });
    if (!modulesResults || modulesResults.length === 0) {
      await makeChaptersData({ studentId: existingStudent._id, studentName: existingStudent.name });
    }
    const studentResults = await StudentResult.find({ studentId: existingStudent._id });
    if (!studentResults || studentResults.length === 0) {
      await createResult({ studentName: existingStudent.name, studentId: existingStudent._id });
    }
    return 'alreadyVerified';
  }

  if (!token) return 'tokenExpired';

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(String(token).trim())
    .digest('hex');

  const user = await Student.findOne({
    email: cleanEmail,
    $or: [
      { resetPasswordToken: resetPasswordToken },
      { resetPasswordToken: String(token).trim() },
    ],
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return 'tokenExpired';
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
  return 'approved';
};

const studensWithTermResults = async ({ term }) => {
  const data = await Student.aggregate([
    {
      $lookup: {
        from: 'studentresults',
        localField: '_id',
        foreignField: 'studentId',
        as: 'StudentResult',
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);
  const cleanTerm = (term || '').toLowerCase();
  return data.filter((item) => (item.name || '').toLowerCase().includes(cleanTerm));
};

const studensWithResults = async () => {
  const data = await Student.aggregate([
    {
      $lookup: {
        from: 'studentresults',
        localField: '_id',
        foreignField: 'studentId',
        as: 'StudentResult',
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);
  return data;
};

const getStudentStatistics = async () => {
  try {
    const stats = await Student.aggregate([
      {
        $facet: {
          totalRegistered: [{ $count: 'count' }],
          completed: [{ $match: { completed: true } }, { $count: 'count' }],
          active: [{ $match: { active: true } }, { $count: 'count' }],
        },
      },
    ]);

    const totalRegisteredCount = stats[0].totalRegistered[0]?.count || 0;
    const completedCount = stats[0].completed[0]?.count || 0;
    const activeCount = stats[0].active[0]?.count || 0;

    return {
      totalRegistered: totalRegisteredCount,
      completed: completedCount,
      active: activeCount,
    };
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    throw error;
  }
};

const changeStudentNameByAdmin = async (id, newName) => {
  await Student.findByIdAndUpdate(id, { $set: { name: newName } });
  await StudentModuleResult.updateMany({ studentId: id }, { $set: { studentName: newName } });
  await StudentResult.updateMany({ studentId: id }, { $set: { studentName: newName } });
  await Form.updateMany({ studentId: id }, { $set: { name: newName } });
  return true;
};

const deleteStudentAccountById = async (id) => {
  const studentStatus = await Student.findByIdAndDelete(id);
  const modulesResults = await StudentModuleResult.deleteMany({ studentId: id });
  const studentResultsStatus = await StudentResult.deleteMany({ studentId: id });
  const formStatus = await Form.deleteMany({ studentId: id });

  return {
    ...studentStatus,
    ...modulesResults,
    ...studentResultsStatus,
    ...formStatus,
  };
};

const deleteStudentAccounts = async () => {
  await Student.deleteMany({});
};

const getAllStudents = async () => {
  const students = await Student.find({}, null, {
    sort: { name: 'asc' },
  });
  return students;
};

const getStudentByID = async (id) => {
  const student = await Student.findById(id, {
    resetPasswordExpire: 0,
    resetPasswordToken: 0,
    __v: 0,
  });
  return student;
};

const getStudentsByTerm = async ({ term }) => {
  const cleanTerm = (term || '').toLowerCase();
  const studentsAll = await Student.find({}, null, {
    sort: { name: 'asc' },
  });
  return studentsAll.filter((s) => (s.name || '').toLowerCase().includes(cleanTerm));
};

const checkNumbersStudent = async ({ email, code }) => {
  if (!email || !code) return null;
  const cleanEmail = email.toLowerCase().trim();
  const studentFound = await Student.findOne({
    email: cleanEmail,
    resetPasswordToken: String(code),
  });
  return !!studentFound;
};

const changePassword = async ({ password, email, code }) => {
  if (!email || !code || !password) return null;
  const cleanEmail = email.toLowerCase().trim();
  const studentFound = await Student.findOne({
    email: cleanEmail,
    resetPasswordToken: String(code),
  });
  if (studentFound) {
    studentFound.password = password;
    studentFound.resetPasswordExpire = undefined;
    studentFound.passwordForgot = undefined;
    studentFound.resetPasswordToken = undefined;
    await studentFound.save();
    return true;
  }
  return null;
};

const generateNumersStudent = async ({ email }) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const studentFound = await Student.findOne({ email: cleanEmail });

  if (studentFound) {
    const pinCode = Math.floor(100000 + Math.random() * 900000);
    studentFound.resetPasswordToken = String(pinCode);
    studentFound.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await studentFound.save();

    await pinCodeEmail({
      userName: studentFound.name,
      email: studentFound.email,
      subject: 'Password Reset Pin Code - United CDL School',
      pinCode,
    });
    return true;
  }
  return null;
};

const createStudentWithDetails = async (name, email, password) => {
  const cleanEmail = email.toLowerCase().trim();
  const studentCreated = await Student.create({
    name,
    email: cleanEmail,
    password,
    verified: false,
    active: false,
    isStudent: false,
    isDataCollected: false,
    isFormApproved: false,
    isEnrolled: false,
    isAgreement: false,
  });

  const resetToken = studentCreated.getResetPasswordToken();
  await studentCreated.save();

  const serverUrl = process.env.SERVER_URL || process.env.BACKEND_END_URL_PROD || 'https://server-bold-nine.vercel.app';
  const verifyURL = `${serverUrl}/api/verifyStudent?token=${resetToken}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(cleanEmail)}`;

  await sendEmail({
    userName: name,
    email: cleanEmail,
    subject: 'Account Verification - United CDL Training School',
    verifyURL,
  });

  return studentCreated;
};

const loginStudent = async (email, password) => {
  if (!email || !password) return null;
  const cleanEmail = email.toLowerCase().trim();
  const student = await Student.findOne({ email: cleanEmail }).select('+password');
  if (!student) return null;
  if (student.password !== password) return null;
  return student;
};

const uploadMultiAssignments = async (req) => {
  const files = req.files;
  const studentId = req.body.id;
  const studentById = await Student.findById(studentId);
  if (!studentById) return false;

  const docsUploading = [];

  for (let i = 0; i < (files || []).length; i++) {
    const fileName_time = files[i]?.originalname;
    const fileName = getFileName(fileName_time);
    if (!fileName) return false;
    const arrBuf = files[i].buffer;

    const uploadParams = {
      Bucket: bucketName,
      Body: arrBuf,
      Key: `Documents/${fileName}`,
      ContentType: files[i].mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `Documents/${fileName}`,
      }),
      { expiresIn: 3600 }
    );
    docsUploading.push({
      fileName,
      url: url.split('?')[0],
    });
  }

  studentById.docs = docsUploading;
  studentById.docsUploaded = true;
  await studentById.save();
  return true;
};

function getFileName(fileName_time) {
  if (!fileName_time) return null;
  const parts = fileName_time.split('.');
  const ext = parts.pop()?.toLowerCase();
  if (['docx', 'pdf', 'odt', 'doc', 'png', 'jpg', 'jpeg'].includes(ext)) {
    const base = parts.join('.');
    return `${base}-${Date.now()}.${ext}`;
  }
  return null;
}

module.exports = {
  loginStudent,
  createStudentWithDetails,
  getAllStudents,
  deleteStudentAccountById,
  deleteStudentAccounts,
  getStudentByID,
  activateStudentByEmail,
  uploadMultiAssignments,
  studensWithResults,
  getStudentsByTerm,
  checkNumbersStudent,
  makeChaptersData,
  changePassword,
  studensWithTermResults,
  generateNumersStudent,
  getChaptersByStudentId,
  changePasswordStudent,
  getChapterByStudentIdAndChapterId,
  changeStudentNameByAdmin,
  getStudentStatistics,
};
