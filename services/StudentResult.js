const Question = require('../models/Question');
const Student = require('../models/Student');
const StudentModuleResult = require('../models/StudentModuleResult');
const StudentResult = require('../models/StudentResult');
const Teacher = require('../models/Teacher');
const Form = require('../models/Form');
const ErrorHandler = require('../utils/errorHandler');

const updateStudentResultsIdOfModules = async () => {
  return true;
};

const deleteStudentModuleResult = async ({ id }) => {
  const overAll = await StudentModuleResult.findByIdAndDelete(id);
  return overAll;
};

const studentModuleResultsOnly = async ({ studentId }) => {
  const overAll = await StudentModuleResult.find({ studentId }).sort({ chapterNo: 1 });
  return overAll;
};

const makeResultsCorrectById = async ({ studentId }) => {
  const modules = await StudentModuleResult.find({ studentId });
  let overAll = await StudentResult.findOne({ studentId });
  if (!overAll) {
    const student = await Student.findById(studentId);
    if (!student) return false;
    overAll = await StudentResult.create({
      studentName: student.name,
      studentId: student._id,
      overAllPercentage: 0,
      lessonCompletedTotal: 0,
    });
  }

  let newOverAllPercentage = 0;
  let newLessonCompleted = 0;

  for (let j = 0; j < modules.length; j++) {
    if (modules[j]?.percentage && modules[j]?.percentage >= 0.8) {
      modules[j].status = 'PASSED';
      if (!modules[j].videoPlayed || modules[j].videoPlayed < 80) {
        modules[j].videoPlayed = 100;
        modules[j].videoCompleted = true;
      }
      await modules[j].save();
    }
    if (modules[j]?.status === 'PASSED') {
      newOverAllPercentage += Number(modules[j]?.percentage) || 0;
      newLessonCompleted++;
    }
  }

  if (newLessonCompleted === 0) {
    overAll.overAllPercentage = 0;
    overAll.lessonCompletedTotal = 0;
    overAll.lastCompleted = 0;
  } else {
    overAll.overAllPercentage = Math.round((newOverAllPercentage / newLessonCompleted) * 100) / 100;
    overAll.lessonCompletedTotal = newLessonCompleted;

    let highestConsecutivePassed = 0;
    for (let i = 1; i <= 35; i++) {
      const mod = modules.find((c) => Number(c.chapterNo) === i);
      if (mod && (mod.status === 'PASSED' || (Number(mod.percentage) || 0) >= 0.8)) {
        highestConsecutivePassed = i;
      } else {
        break;
      }
    }
    overAll.lastCompleted = highestConsecutivePassed;

    if (newLessonCompleted >= 35) {
      const studentFound = await Student.findById(overAll.studentId);
      if (studentFound) {
        studentFound.completed = true;
        studentFound.completedAt = Date.now();
        await studentFound.save();
      }
    }
  }
  await overAll.save();
  return true;
};

const makeResultsCorrect = async ({ studentName }) => {
  const modules = await StudentModuleResult.find({ studentName });
  const overAll = await StudentResult.findOne({ studentName });
  if (!overAll) return false;

  let newOverAllPercentage = 0;
  let newLessonCompleted = 0;
  for (let j = 0; j < modules.length; j++) {
    if (modules[j]?.percentage && modules[j]?.percentage >= 0.8) {
      modules[j].status = 'PASSED';
      if (!modules[j].videoPlayed || modules[j].videoPlayed < 80) {
        modules[j].videoPlayed = 100;
        modules[j].videoCompleted = true;
      }
      await modules[j].save();
    }
    if (modules[j]?.status === 'PASSED') {
      newOverAllPercentage += Number(modules[j]?.percentage) || 0;
      newLessonCompleted++;
    }
  }

  if (newLessonCompleted === 0) {
    overAll.overAllPercentage = 0;
    overAll.lessonCompletedTotal = 0;
    overAll.lastCompleted = 0;
  } else {
    overAll.overAllPercentage = Math.round((newOverAllPercentage / newLessonCompleted) * 100) / 100;
    overAll.lessonCompletedTotal = newLessonCompleted;

    let highestConsecutivePassed = 0;
    for (let i = 1; i <= 35; i++) {
      const mod = modules.find((c) => Number(c.chapterNo) === i);
      if (mod && (mod.status === 'PASSED' || (Number(mod.percentage) || 0) >= 0.8)) {
        highestConsecutivePassed = i;
      } else {
        break;
      }
    }
    overAll.lastCompleted = highestConsecutivePassed;

    if (newLessonCompleted >= 35) {
      const studentFound = await Student.findById(overAll.studentId);
      if (studentFound) {
        studentFound.completed = true;
        studentFound.completedAt = Date.now();
        await studentFound.save();
      }
    }
  }
  await overAll.save();
  return true;
};

const removeDuplicate = async ({ studentName }) => {
  const results = await StudentModuleResult.find({ studentName });
  return results;
};

const forcedComplete = async ({ studentName, studentId, adminId, adminPassword }) => {
  const admin = await Teacher.findById(adminId).select('+password');
  if (!admin || admin.password !== adminPassword) {
    throw new ErrorHandler('Admin password is incorrect', 400);
  }

  const results = await StudentModuleResult.find({ studentId });
  for (let i = 0; i < results.length; i++) {
    results[i].marks = 10;
    results[i].percentage = 1;
    results[i].attempted = true;
    results[i].status = 'PASSED';
    results[i].videoCompleted = true;
    results[i].videoPlayed = 100;
    await results[i].save();
  }

  const student = await Student.findById(studentId);
  if (student) {
    student.completed = true;
    student.completedAt = new Date();
    await student.save();
  }

  let overAll = await StudentResult.findOne({ studentId });
  if (overAll) {
    overAll.overAllPercentage = 1;
    overAll.lessonCompletedTotal = 35;
    overAll.lastCompleted = 35;
    await overAll.save();
  }

  return true;
};

const forcedDelete = async ({ studentId, adminId, adminPassword }) => {
  const admin = await Teacher.findById(adminId).select('+password');
  if (!admin || admin.password !== adminPassword) {
    throw new ErrorHandler('Admin password is incorrect', 400);
  }

  const studentStatus = await Student.findByIdAndDelete(studentId);
  const modulesResults = await StudentModuleResult.deleteMany({ studentId });
  const studentResultsStatus = await StudentResult.deleteMany({ studentId });
  const formStatus = await Form.deleteMany({ studentId });

  return {
    ...studentStatus,
    ...modulesResults,
    ...studentResultsStatus,
    ...formStatus,
  };
};

const manageResultAndUpdate = async () => {
  const students = await Student.find();
  for (let i = 0; i < students.length; i++) {
    const modules = await StudentModuleResult.find({
      studentId: students[i]._id,
    });
    const overAll = await StudentResult.findOne({
      studentId: students[i]._id,
    });
    if (overAll) {
      let newOverAllPercentage = 0;
      let newLessonCompleted = 0;
      for (let j = 0; j < modules.length; j++) {
        if (modules[j]?.status === 'PASSED') {
          newOverAllPercentage += Number(modules[j]?.percentage) || 0;
          newLessonCompleted++;
        }
      }
      overAll.lessonCompletedTotal = newLessonCompleted;
      overAll.overAllPercentage = newLessonCompleted > 0
        ? Math.round((newOverAllPercentage / newLessonCompleted) * 100) / 100
        : 0;

      let highestConsecutivePassed = 0;
      for (let k = 1; k <= 35; k++) {
        const mod = modules.find((c) => Number(c.chapterNo) === k);
        if (mod && (mod.status === 'PASSED' || (Number(mod.percentage) || 0) >= 0.8)) {
          highestConsecutivePassed = k;
        } else {
          break;
        }
      }
      overAll.lastCompleted = highestConsecutivePassed;

      await overAll.save();
    }
  }
  return students;
};

const videoUpdateOfModule = async ({ studentId, chapterId, videoPercentage }) => {
  const modNo = Number(chapterId);
  let studentResult = await StudentModuleResult.findOne({
    studentId: studentId,
    chapterNo: modNo,
  });

  if (!studentResult) {
    const student = await Student.findById(studentId);
    if (student) {
      studentResult = await StudentModuleResult.create({
        studentName: student.name,
        studentId: student._id,
        chapterNo: modNo,
        chapterName: `Module ${modNo}`,
      });
    }
  }

  if (studentResult) {
    const newPlayed = Math.min(100, Math.max(0, Number(videoPercentage) || 0));
    studentResult.videoPlayed = Math.max(studentResult.videoPlayed || 0, newPlayed);
    if (studentResult.videoPlayed >= 80) {
      studentResult.videoCompleted = true;
      if (studentResult.status === 'NOT_ATTEMPTED') {
        studentResult.status = 'VIDEO_COMPLETED';
      }
    }
    await studentResult.save();
  }
  return true;
};

const getStudentResults = async ({ studentId }) => {
  const result = await StudentResult.find({ studentId });
  return result;
};

const createResult = async ({ studentName, studentId }) => {
  let result = await StudentResult.findOne({ studentId });
  if (!result) {
    result = await StudentResult.create({
      studentName,
      studentId,
      overAllPercentage: 0,
      lessonCompletedTotal: 0,
    });
  }
  return result;
};

const calculateResult = async ({ studentId, questions, moduleName, moduleNo }) => {
  const modNo = Number(moduleNo);

  // Enforce sequential prerequisite: Previous module must be PASSED before attempting this quiz
  if (modNo > 1) {
    const prevModule = await StudentModuleResult.findOne({
      studentId,
      chapterNo: modNo - 1,
    });
    const prevPassed = prevModule && (prevModule.status === 'PASSED' || (Number(prevModule.percentage) || 0) >= 0.8);
    if (!prevPassed) {
      throw new ErrorHandler(`Module ${modNo} is locked. You must complete and pass Module ${modNo - 1} first.`, 400);
    }
  }

  const dbQuestions = await Question.find({ chapterId: modNo });
  let correct = 0;
  let wrong = 0;

  const totalQuestions = dbQuestions && dbQuestions.length > 0 ? dbQuestions.length : ((questions && questions.length) || 1);

  if (dbQuestions && dbQuestions.length > 0) {
    dbQuestions.forEach((questionItem) => {
      for (let i = 0; i < (questions || []).length; i++) {
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
  } else {
    // If questions provided in payload
    (questions || []).forEach((q) => {
      if (q.selected && q.quesAnswer && q.selected === q.quesAnswer) {
        q.isCorrect = true;
        correct++;
      } else {
        q.isCorrect = false;
        wrong++;
      }
    });
  }

  const percentage = Math.round((correct / totalQuestions) * 100) / 100;

  // 1. Update StudentModuleResult
  let studentResult = await StudentModuleResult.findOne({
    studentId: studentId,
    chapterNo: modNo,
  });

  if (!studentResult) {
    const student = await Student.findById(studentId);
    studentResult = await StudentModuleResult.create({
      studentName: student?.name || '',
      studentId: studentId,
      chapterNo: modNo,
      chapterName: moduleName || `Module ${modNo}`,
      videoPlayed: 100,
      videoCompleted: true,
    });
  }

  studentResult.marks = correct;
  studentResult.percentage = percentage;
  studentResult.attempted = true;
  if (!studentResult.videoPlayed || studentResult.videoPlayed < 80) {
    studentResult.videoPlayed = 100;
  }
  studentResult.videoCompleted = true;
  if (percentage >= 0.8) {
    studentResult.status = 'PASSED';
  } else {
    studentResult.status = 'FAILED';
  }
  await studentResult.save();

  // 2. Update StudentResult overall progress
  let overAll = await StudentResult.findOne({ studentId });
  if (!overAll) {
    const student = await Student.findById(studentId);
    overAll = await StudentResult.create({
      studentName: student?.name || studentResult.studentName,
      studentId,
      overAllPercentage: 0,
      lessonCompletedTotal: 0,
    });
  }

  const allChapters = await StudentModuleResult.find({ studentId });
  let newOverAllPercentage = 0;
  let newLessonCompleted = 0;

  for (let i = 0; i < allChapters.length; i++) {
    if (allChapters[i]?.status === 'PASSED') {
      newOverAllPercentage += Number(allChapters[i]?.percentage) || 0;
      newLessonCompleted++;
    }
  }

  overAll.lessonCompletedTotal = newLessonCompleted;
  overAll.overAllPercentage = newLessonCompleted > 0
    ? Math.round((newOverAllPercentage / newLessonCompleted) * 100) / 100
    : 0;

  // Calculate highest consecutive passed module (1..35)
  let highestConsecutivePassed = 0;
  for (let i = 1; i <= 35; i++) {
    const mod = allChapters.find((c) => Number(c.chapterNo) === i);
    const modPassed = mod && (mod.status === 'PASSED' || (Number(mod.percentage) || 0) >= 0.8);
    if (modPassed) {
      highestConsecutivePassed = i;
    } else {
      break;
    }
  }
  overAll.lastCompleted = highestConsecutivePassed;

  if (newLessonCompleted >= 35) {
    const studentFound = await Student.findById(studentId);
    if (studentFound) {
      studentFound.completed = true;
      studentFound.completedAt = Date.now();
      await studentFound.save();
    }
  }
  await overAll.save();

  return { correct, wrong, percentage, question: questions };
};

const addResult = async ({ studentId, marks, moduleNo, percentage }) => {
  return await calculateResult({
    studentId,
    questions: [],
    moduleName: `Module ${moduleNo}`,
    moduleNo,
  });
};

const getResultsOfStudentById = async ({ studentId }) => {
  const result = await StudentModuleResult.find({ studentId }).sort({ chapterNo: 1 });
  return result;
};

const getResultsOfChapterByStudentId = async ({ studentId }) => {
  let result = await StudentResult.findOne({ studentId });
  if (!result) {
    const student = await Student.findById(studentId);
    if (student) {
      result = await StudentResult.create({
        studentName: student.name,
        studentId: student._id,
        overAllPercentage: 0,
        lessonCompletedTotal: 0,
      });
    }
  }
  return result || {
    overAllPercentage: 0,
    lessonCompletedTotal: 0,
    lastCompleted: 0,
  };
};

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
