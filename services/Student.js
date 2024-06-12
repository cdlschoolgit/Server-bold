const catchAsyncErrors = require('../middlewares/catchAsyncError');
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
const bucketName = 'united-cdl-school';

const changePasswordStudent = catchAsyncErrors(
  async ({ password, email, code }) => {
    console.log(code, email);

    const studentFound = await Student.find({
      email: email,
      resetPasswordToken: Number(code),
    });
    if (studentFound.length > 0) {
      studentFound[0].resetPasswordExpire = undefined;
      studentFound[0].resetPasswordToken = undefined;

      studentFound[0].password = password;
      await studentFound[0].save();
      return true;
    }
    return null;
  }
);

const getChaptersByStudentId = catchAsyncErrors(async ({ studentId }) => {
  const chapters = await StudentModuleResult.find({ studentId });
  return chapters;
});

const getChapterByStudentIdAndChapterId = catchAsyncErrors(
  async ({ studentId, chapterNo }) => {
    const chapters = await StudentModuleResult.find({ studentId, chapterNo });
    return chapters[0];
  }
);

const makeChaptersData = catchAsyncErrors(
  async ({ studentId, studentName }) => {
    for (let i = 0; i < 35; i++) {
      await StudentModuleResult.create({
        studentName: studentName,
        studentId: studentId,
        chapterNo: chaptersData[i].customIndex,
        chapterName: chaptersData[i].name,
      });
    }
  }
);

const activateStudentByEmail = catchAsyncErrors(async (token, email) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    email,
  });
  if (!user) {
    return 'tokenExpired';
  } else {
    user.verified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    const modulesResults = await StudentModuleResult.find({
      studentName: user.name,
    });

    const studentResults = await StudentResult.find({ studentName: user.name });
    if (modulesResults.length === 0)
      // eslint-disable-next-line no-underscore-dangle
      await makeChaptersData({ studentId: user?._id, studentName: user.name });
    if (studentResults.length == 0)
      await createResult({ studentName: user.name, studentId: user?._id });

    await user.save();

    return 'approved';
  }
});

const studensWithTermResults = catchAsyncErrors(async ({ term }) => {
  const students = [];
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
      $sort: { name: 1 }, // Sort by name in ascending order (1)
    },
  ]);
  for (let i = 0; i < data.length; i++) {
    if (data[i].name.includes(term)) students.push(data[i]);
  }
  return students;
});

const studensWithResults = catchAsyncErrors(async () => {
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
      $sort: { name: 1 }, // Sort by name in ascending order (1)
    },
  ]);
  return data;
});

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

const changeStudentNameByAdmin = catchAsyncErrors(async (id, newName) => {
  await Student.findOneAndUpdate(id, {
    $set: { name: newName },
  });
  await StudentModuleResult.findOneAndUpdate(id, {
    $set: { studentName: newName },
  });
  await StudentResult.findOneAndUpdate(id, {
    $set: { studentName: newName },
  });
  await Form.findOneAndUpdate(id, {
    $set: { name: newName },
  });
  return true;
});

const deleteStudentAccountById = catchAsyncErrors(async (id) => {
  const studentStatus = await Student.findByIdAndDelete(id);
  const modulesResults = await StudentModuleResult.deleteMany({
    studentId: id,
  });
  const studentResultsStatus = await StudentResult.deleteMany({
    studentId: id,
  });
  const formStatus = await Form.deleteMany({ studentId: id });

  return {
    ...studentStatus,
    ...modulesResults,
    ...studentResultsStatus,
    ...formStatus,
  };
});

const deleteStudentAccounts = catchAsyncErrors(async () => {
  await Student.deleteMany({});
  return;
});
const getAllStudents = catchAsyncErrors(async () => {
  const students = await Student.find({}, null, {
    sort: { name: 'asc' },
  });
  return students;
});
const getStudentByID = catchAsyncErrors(async (id) => {
  const student = await Student.findById(id, {
    resetPasswordExpire: 0,
    resetPasswordToken: 0,
    __v: 0,
  });
  return student;
});

const getStudentsByTerm = catchAsyncErrors(async ({ term }) => {
  logger.info(term);
  // const students = await Student.find({
  //   userName: { $regex: `/a/`, $options: "i" },
  // });
  const students = [];
  const studentsAll = await Student.find({}, null, {
    sort: { name: 'asc' },
  });
  for (let i = 0; i < studentsAll.length; i++) {
    if (studentsAll[i].name.includes(term)) students.push(studentsAll[i]);
  }
  // console.log(students);
  return students;
});

const checkNumbersStudent = catchAsyncErrors(async ({ email, code }) => {
  const studentFound = await Student.find({ email, code });
  if (studentFound.length > 0) {
    if (studentFound[0].resetPasswordToken == code) {
      return true;
    } else return null;
  } else return null;
});
const changePassword = catchAsyncErrors(async ({ password, email, code }) => {
  const studentFound = await Student.find({ email, code });
  if (studentFound.length > 0) {
    studentFound[0].password = password;
    studentFound[0].resetPasswordExpire = undefined;
    studentFound[0].passwordForgot = undefined;
    studentFound[0].resetPasswordToken = undefined;
    await studentFound[0].save();
  } else return null;
});
const generateNumersStudent = catchAsyncErrors(async ({ email }) => {
  const studentFound = await Student.find({ email: email });
  // console.log("student", studentFound);

  if (studentFound.length > 0) {
    studentFound[0].resetPasswordToken = Math.floor(Math.random() * 9000000);
    studentFound[0].resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    pinCodeEmail({
      userName: studentFound[0].name,
      email: studentFound[0].email,
      subject: 'Password Reset PinCode',
      pinCode: studentFound[0].resetPasswordToken,
    });
    // console.log("email sent");
    await studentFound[0].save();
    return true;
  } else return null;
});

const createStudentWithDetails = catchAsyncErrors(
  async (name, email, password) => {
    const studentCreated = await Student.create({ name, email, password });
    const resetToken = studentCreated.getResetPasswordToken();

    // const SERVER_URL = "https://traffic-assessment.herokuapp.com";
    const verifyURL = `https://server-bold.vercel.app/verifyStudent/?token=${resetToken}&name=${name}&email=${email}`;
    sendEmail({
      userName: name,
      email: email,
      subject: 'Account Verification Through Email',
      verifyURL,
    });
    console.log("sending email")
    studentCreated.save();
    return studentCreated;
  }
);

// For Making Request Only

// For Making Request Only

const loginStudent = catchAsyncErrors(async (email, password) => {
  const students = await Student.find({
    email: { $regex: email, $options: 'i' },
  }).select('+password');
  if (students.length == 0) return null;
  const isPasswordMatched = students[0].password == password;
  if (isPasswordMatched) return students[0];
  else return null;
});

// function checkIsEnrolledAndRequest(requests, studentId, enrollments) {
//   const requested = requests.filter((item) => item == studentId);
//   if (requested.length > 0) {
//     return true;
//   }
//   const enrolled = enrollments.filter((item) => item == studentId);
//   if (enrolled.length > 0) {
//     return true;
//   }

//   return false;
// }

const uploadMultiAssignments = catchAsyncErrors(async (req) => {
  const files = req.files;
  const studentId = req.body.id;
  const studentById = await Student.findById(studentId);
  const docsUploading = [];

  for (let i = 0; i < files.length; i++) {
    const fileName_time = files[i]?.originalname;
    const fileName = getFileName(fileName_time);
    if (fileName == undefined) return false;
    const arrBuf = files[i].buffer;

    // Configure the upload details to send to S3

    const uploadParams = {
      Bucket: bucketName,
      Body: arrBuf,
      Key: `Documents/${fileName}`,
      ContentType: files[i].mimetype,
    };

    // push image on server
    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `Documents/${fileName}`,
      }),
      { expiresIn: 60 } // 60 seconds
    );
    docsUploading.push({
      fileName,
      url: url.split('?')[0],
    });
  }
  studentById.docs = docsUploading;
  studentById.docsUploaded = true;
  studentById.save();

  return true;
});

function getFileName(fileName_time) {
  const name_array = fileName_time.split('.');
  if (
    name_array[1] == 'docx' ||
    name_array[1] == 'pdf' ||
    name_array[1] == 'odt' ||
    name_array[1] == 'doc'
  ) {
    name_array.splice(1, 0, '-' + new Date().toUTCString() + '.');
    let finalFileName = '';
    name_array.forEach((element) => {
      finalFileName += element;
    });
    return finalFileName;
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
