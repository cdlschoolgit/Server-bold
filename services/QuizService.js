const catchAsyncErrors = require('../middlewares/catchAsyncError');
const QuestionSchema = require('../models/Question');
const Chapter = require('../models/Chapter');
const StudentResult = require('../models/StudentResult');

const createChapter = catchAsyncErrors(
  async ({ name, videoLink, videoLinks, customIndex, description }) => {
    const chapter = await Chapter.create({
      name,
      videoLink,
      videoLinks,
      customIndex,
      description,
      lastUpdated: new Date(),
    });
    return chapter;
  }
);
const addQuestion = catchAsyncErrors(
  async ({ questionText, chapterId, description, quesOptions, quesAnswer }) => {
    const question = await QuestionSchema.create(
      questionText,
      chapterId,
      description,
      quesOptions,
      quesAnswer
    );
    return question;
  }
);

const addQuestions = catchAsyncErrors(async ({ questions }) => {
  const questionsCreated = await QuestionSchema.insertMany(questions);
  return questionsCreated;
});
const getChapterQuestionById = catchAsyncErrors(async ({ chapterId }) => {
  const questions = await QuestionSchema.find(
    { chapterId: chapterId },
    { quesAnswer: 0 }
  );
  return questions;
});

const getChaptersDetailsByID = catchAsyncErrors(async ({ chapterId }) => {
  const chapter = await Chapter.find({ customIndex: chapterId });
  return chapter;
});

const getAllChaptersDetails = catchAsyncErrors(async () => {
  const chapters = await Chapter.find().sort({ customIndex: 1 });
  return chapters;
});

module.exports = {
  getAllChaptersDetails,
  createChapter,
  getChapterQuestionById,
  addQuestion,
  addQuestions,
  getChaptersDetailsByID,
};
