const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  getChapterQuestionById,
  getAllChaptersDetails,
  getChaptersDetailsByID,
} = require('../services/QuizService');
const {
  getChaptersByStudentId,
  getChapterByStudentIdAndChapterId,
} = require('../services/Student');
const {
  getResultsOfChapterByStudentId,
  videoUpdateOfModule,
  updateStudentResultsIdOfModules,
  getResultsOfStudentById,
} = require('../services/StudentResult');

exports.updateTheIdOfStudentInModules = catchAsyncErrors(async (req, res) => {
  const data = await updateStudentResultsIdOfModules();

  res.status(200).json({
    data,
  });
});

exports.getAllChapters = catchAsyncErrors(async (req, res) => {
  // const chapters = []
     await getAllChaptersDetails();
  res.status(200).json({
    success: true,
    chapters,
  });
});
exports.videoUpdate = catchAsyncErrors(async (req, res) => {
  const { studentId, chapterId, videoPercentage } = req.body;

  await videoUpdateOfModule({
    studentId,
    chapterId,
    videoPercentage,
  });
  res.status(200).json({
    success: true,
  });
});

exports.getChapterByStudentId = catchAsyncErrors(async (req, res) => {
  const { studentId, chapterNo } = req.params;
  const chapter = await getChapterByStudentIdAndChapterId({
    studentId,
    chapterNo,
  });
  res.status(200).json({
    success: true,
    chapter,
  });
});

exports.getAllChaptersByStudentId = catchAsyncErrors(async (req, res) => {
  const { studentId } = req.params;
  const chapters =[]
   //  await getChaptersByStudentId({ studentId });
  res.status(200).json({
    success: true,
    chapters,
  });
});

exports.getChapter = catchAsyncErrors(async (req, res) => {
  const { chapterId } = req.params;
  const chapter = await getChaptersDetailsByID({ chapterId });
  res.status(200).json({
    success: true,
    chapter,
  });
});

exports.getResultsOfChapterOfStudentUpdated = catchAsyncErrors(
  async (req, res) => {
    const { studentId } = req.params;
    const studentResults = await getResultsOfStudentById({ studentId });
    res.status(200).json({
      success: true,
      studentResults,
    });
  }
);
exports.getResultsOfChapterOfStudent = catchAsyncErrors(async (req, res) => {
  const { studentId } = req.params;
  const studentResults = await getResultsOfChapterByStudentId({ studentId });
  res.status(200).json({
    success: true,
    studentResults,
  });
});
exports.getChapterQuestion = catchAsyncErrors(async (req, res) => {
  const { chapterId } = req.params;
  const questions = await getChapterQuestionById({ chapterId });
  res.status(200).json({
    success: true,
    questions,
  });
});

// exports.checkQuiz = catchAsyncErrors(async (req, res, next) => {
//   const { moduleNo, questionWithAsnwer, studentId } = req.body;
//   const result = await checkQuizWithDetails({
//     moduleNo,
//     questionWithAsnwer,
//     studentId,
//   });
//   // also update the result
//   res.status(200).json({
//     success: true,
//     result,
//   });
// });
