const catchAsyncErrors = require('../middlewares/catchAsyncError');
const Question = require('../models/Question');
const Student = require('../models/Student');
const StudentModuleResult = require('../models/StudentModuleResult');
const StudentResult = require('../models/StudentResult');
const Teacher = require('../models/Teacher');
const Form = require('../models/Form');

const ErrorHandler = require('../utils/errorHandler');

const updateStudentResultsIdOfModules = catchAsyncErrors(async () => {
  await StudentModuleResult.updateMany(
    { studentName: 'Taylor Stiles' }, // Filter the document(s) to update
    { $set: { studentId: '644beb324c8abc0aed074142' } }, // Update the fields
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        return result;
      }
    }
  );
});

const deleteStudentModuleResult = catchAsyncErrors(async ({ id }) => {
  const overAll = await StudentModuleResult.findByIdAndDelete(id);
  console.log(id);

  return overAll;
});
const studentModuleResultsOnly = catchAsyncErrors(async ({ studentId }) => {
  const overAll = await StudentModuleResult.find({ studentId });
  return overAll;
});

const makeResultsCorrectById = catchAsyncErrors(async ({ studentId }) => {
  const modules = await StudentModuleResult.find({ studentId });
  const overAll = await StudentResult.findOne({ studentId });
  let newOverAllPercentage = 0;
  let newLessonCompleted = 0;

  for (let j = 0; j < modules.length; j++) {
    if (modules[j]?.percentage && modules[j]?.percentage >= 0.8) {
      modules[j].status = 'PASSED';
    }
    newOverAllPercentage += modules[j]?.percentage || 0;
    newLessonCompleted += modules[j]?.status === 'PASSED' ? 1 : 0;
  }
  console.log(
    overAll.studentName,
    newLessonCompleted + ' :: ' + newOverAllPercentage
  );
  // console.log(newOverAllPercentage, newLessonCompleted);
  if (newLessonCompleted == 0) {
    overAll.overAllPercentage = 0;
    overAll.lessonCompletedTotal = 0;
  } else {
    overAll.overAllPercentage = newOverAllPercentage / newLessonCompleted;
    overAll.lessonCompletedTotal = newLessonCompleted;
    if (newLessonCompleted == 35) {
      const studentFound = await Student.findById(overAll.studentId);
      studentFound.completed = true;
      studentFound.completedAt = Date.now();
      await studentFound.save();
    }
  }
  await overAll.save();
  return true;
});

const makeResultsCorrect = catchAsyncErrors(async ({ studentName }) => {
  const modules = await StudentModuleResult.find({ studentName });
  const overAll = await StudentResult.findOne({ studentName });
  console.log(modules.length, 'modules_of_haseeb');
  let newOverAllPercentage = 0;
  let newLessonCompleted = 0;
  for (let j = 0; j < modules.length; j++) {
    if (modules[j]?.percentage && modules[j]?.percentage >= 0.8) {
      modules[j].status = 'PASSED';
    }
    newOverAllPercentage += Number(modules[j]?.percentage) || 0;
    newLessonCompleted += modules[j]?.status === 'PASSED' ? 1 : 0;
  }
  console.log(
    overAll.studentName,
    newLessonCompleted + ' :: ' + newOverAllPercentage
  );
  // console.log(newOverAllPercentage, newLessonCompleted);
  if (newLessonCompleted == 0) {
    overAll.overAllPercentage = 0;
    overAll.lessonCompletedTotal = 0;
  } else {
    overAll.overAllPercentage = newOverAllPercentage / newLessonCompleted;
    overAll.lessonCompletedTotal = newLessonCompleted;
    if (newLessonCompleted == 35) {
      const studentFound = await Student.findById(overAll.studentId);
      studentFound.completed = true;
      studentFound.completedAt = Date.now();
      await studentFound.save();
    }
  }
  await overAll.save();
  return true;
});

// const removeDataOfLessons = catchAsyncErrors(async ({ studentName }) => {
//   const studentFound = await Student.findOne({ name: studentName });
//   if (studentFound != undefined) {
//     if (studentFound.completed === true) {
//       const results = await StudentModuleResult.find({
//         studentName: studentName,
//       });
//       for (let i = 0; i < results.length; i++) {
//         await results[i].delete();
//       }
//     } else return false;
//   } else return false;
// });

const removeDuplicate = catchAsyncErrors(async ({ studentName }) => {
  const results = await StudentModuleResult.find({ studentName });
  // for (let i = 35; i < results.length; i++) {
  // await results[i].delete();
  // }
  return results;
});
const forcedComplete = catchAsyncErrors(
  async ({ studentName, studentId, adminId, adminPassword }) => {
    const admin = await Teacher.findById(adminId).select('+password');
    console.log(admin);
    if (admin?.password !== adminPassword) {
      throw new ErrorHandler('the password is incorrect');
    }

    const results = await StudentModuleResult.find({ studentName, studentId });
    for (let i = 0; i < results.length; i++) {
      // 20 27 30 32 33 34
      if (
        results[i].chapterNo == 20 ||
        results[i].chapterNo == 27 ||
        results[i].chapterNo == 30 ||
        results[i].chapterNo == 32 ||
        results[i].chapterNo == 33 ||
        results[i].chapterNo == 34
      ) {
        results[i].marks = 5;
        results[i].percentage = 1;
      } else {
        results[i].marks = 9;
        results[i].percentage = 0.9;
      }
      results[i].attempted = true;
      results[i].status = 'PASSED';
      results[i].videoCompleted = true;
      results[i].videoPlayed = 100;
      await results[i].save();
      const student = await Student.findById(studentId);
      student.completed = true;
      student.completedAt = new Date();
      await student.save();

      // await Student.findByIdAndUpdate(studentId, {
      //   pu
      // });
    }
    return true;
  }
);
const forcedDelete = catchAsyncErrors(
  async ({ studentId, adminId, adminPassword }) => {
    const admin = await Teacher.findById(adminId).select('+password');
    console.log(admin);
    if (admin?.password !== adminPassword) {
      throw new ErrorHandler('the password is incorrect');
    }

    const studentStatus = await Student.findByIdAndDelete(studentId);
    const modulesResults = await StudentModuleResult.deleteMany({
      studentId: studentId,
    });
    const studentResultsStatus = await StudentResult.deleteMany({
      studentId: studentId,
    });
    const formStatus = await Form.deleteMany({ studentId });

    return {
      ...studentStatus,
      ...modulesResults,
      ...studentResultsStatus,
      ...formStatus,
    };
  }
);

const manageResultAndUpdate = catchAsyncErrors(async () => {
  const students = await Student.find();
  for (let i = 0; i < students.length; i++) {
    const modules = await StudentModuleResult.find({
      studentId: students[i]._id,
    });
    const overAll = await StudentResult.findOne({
      studentId: students[i]._id,
    });
    if (overAll != undefined) {
      let newOverAllPercentage = 0;
      let newLessonCompleted = 0;
      for (let j = 0; j < modules.length; j++) {
        newOverAllPercentage += modules[j]?.percentage || 0;
        newLessonCompleted += modules[j]?.status === 'PASSED' ? 1 : 0;
      }
      console.log(
        overAll.studentName,
        newLessonCompleted + ' :: ' + newLessonCompleted
      );
      // console.log(newOverAllPercentage, newLessonCompleted);
      if (newLessonCompleted == 0) {
        overAll.overAllPercentage = 0;
        overAll.lessonCompletedTotal = 0;
      } else {
        overAll.overAllPercentage = newOverAllPercentage / newLessonCompleted;
        overAll.lessonCompletedTotal = newLessonCompleted;
      }

      await overAll.save();
    }
  }
  return students;
});

const videoUpdateOfModule = catchAsyncErrors(
  async ({ studentId, chapterId, videoPercentage }) => {
    const studentResult = await StudentModuleResult.findOne({
      studentId: studentId,
      chapterNo: chapterId,
    });
    if (videoPercentage >= 80) {
      studentResult.videoCompleted = true;
      studentResult.status = 'VIDEO_COMPLETED';
    }
    studentResult.videoPlayed = videoPercentage;
    await studentResult.save();
  }
);

const getStudentResults = catchAsyncErrors(async ({ studentId }) => {
  const result = await StudentResult.find({
    studentId,
  });
  return result;
});
const createResult = catchAsyncErrors(async ({ studentName, studentId }) => {
  const result = await StudentResult.create({
    studentName,
    studentId,
  });
  return result;
});
const calculateResult = catchAsyncErrors(
  async ({ studentId, questions, moduleName, moduleNo }) => {
    const question = await Question.find({ chapterId: moduleNo });
    console.log(question?.length);
    let correct = 0;
    let wrong = 0;
    question?.map((questionItem) => {
      for (let i = 0; i < questions?.length; i++) {
        if (questionItem.questionText === questions[i].questionText) {
          if (questionItem.quesAnswer === questions[i].selected) {
            questions[i].correct = questionItem.quesAnswer;
            questions[i].isCorrect = true;

            correct++;
          } else {
            wrong++;
            questions[i].correct = questionItem.quesAnswer;
            questions[i].isCorrect = false;
          }
        }
      }
    });
    const percentage = correct / question.length;
    if (percentage >= 0.8) {
      await addResult({
        studentId,
        moduleName,
        moduleNo,
        marks: correct,
        percentage,
      });
    } else {
      const studentResult = await StudentModuleResult.findOne({
        studentId: studentId,
        chapterNo: moduleNo,
      });
      studentResult.attempted = true;
      studentResult.status = 'FAILED';
      await studentResult.save();
    }
    return { correct, wrong, percentage, question: questions };
  }
);

const addResult = catchAsyncErrors(
  async ({ studentId, marks, moduleNo, percentage }) => {
    // {moduleName: "Module 1", marks: 90, percentage: 90%, attemptedAt: new Date()};

    const result = await StudentResult.find({ studentId: studentId });
    const studentResult = await StudentModuleResult.findOne({
      studentId: studentId,
      chapterNo: moduleNo,
    });

    studentResult.marks = marks;
    studentResult.percentage = percentage;
    studentResult.status = 'PASSED';
    studentResult.attempted = true;
    await studentResult.save();

    let newOverAllPercentage = 0;
    let newLessonCompleted = 0;

    const allChapters = await StudentModuleResult.find({
      studentId: studentId,
    });
    for (let i = 0; i < allChapters.length; i++) {
      newOverAllPercentage += allChapters[i]?.percentage || 0;
      newLessonCompleted += allChapters[i]?.status === 'PASSED' ? 1 : 0;
    }

    result[0].overAllPercentage = newOverAllPercentage / newLessonCompleted;
    result[0].lessonCompletedTotal = newLessonCompleted;

    if (newLessonCompleted == 35) {
      const studentFound = await Student.findById(studentId);
      studentFound.completed = true;
      studentFound.completedAt = Date.now();
      await studentFound.save();
    }
    result[0].lastCompleted = moduleNo;
    await result[0].save();
    return result[0];
  }
);

const getResultsOfStudentById = catchAsyncErrors(async ({ studentId }) => {
  const result = await StudentModuleResult.findById({ studentId });
  return result;
});

const getResultsOfChapterByStudentId = catchAsyncErrors(
  async ({ studentId }) => {
    const result = await StudentResult.find({ studentId: studentId });

    if (result.length > 0) {
      return result[0];
    } else return [];
  }
);

module.exports = {
  createResult,
  getResultsOfChapterByStudentId,
  addResult,
  manageResultAndUpdate,
  calculateResult,
  getStudentResults,
  forcedComplete,
  videoUpdateOfModule,
  removeDuplicate,
  forcedDelete,

  deleteStudentModuleResult,
  studentModuleResultsOnly,
  makeResultsCorrect,
  makeResultsCorrectById,
  getResultsOfStudentById,
  updateStudentResultsIdOfModules,
};
