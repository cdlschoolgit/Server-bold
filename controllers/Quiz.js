const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  getChapterQuestionById,
  getAllChaptersDetails,
  getChaptersDetailsByID,
  getAllQuestionsWithAnswers,
  updateQuestionById,
  createQuestion,
  deleteQuestionById,
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
  const chapters = await getAllChaptersDetails();
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
  const chapters = await getChaptersByStudentId({ studentId });
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

exports.adminGetAllQuestions = catchAsyncErrors(async (req, res) => {
  const { chapterId, search } = req.query;
  const questions = await getAllQuestionsWithAnswers({ chapterId, search });
  res.status(200).json({
    success: true,
    count: questions.length,
    questions,
  });
});

exports.adminUpdateQuestion = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { questionText, chapterId, quesOptions, quesAnswer } = req.body;
  const updated = await updateQuestionById(id, {
    questionText,
    chapterId,
    quesOptions,
    quesAnswer,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Question updated successfully',
    question: updated,
  });
});

exports.adminCreateQuestion = catchAsyncErrors(async (req, res) => {
  const { questionText, chapterId, quesOptions, quesAnswer } = req.body;
  if (!questionText || !chapterId || !quesOptions || !quesAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Question text, chapterId, options, and correct answer are required',
    });
  }
  const created = await createQuestion({
    questionText,
    chapterId,
    quesOptions,
    quesAnswer,
  });
  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    question: created,
  });
});

exports.adminDeleteQuestion = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteQuestionById(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
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
