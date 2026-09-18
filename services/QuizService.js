const QuestionSchema = require('../models/Question');
const Chapter = require('../models/Chapter');
const chaptersData = require('../data/chapters.json');

const createChapter = async ({ name, videoLink, videoLinks, customIndex, description }) => {
  const chapter = await Chapter.create({
    name,
    videoLink,
    videoLinks,
    customIndex,
    description,
    lastUpdated: new Date(),
  });
  return chapter;
};

const addQuestion = async ({ questionText, chapterId, description, quesOptions, quesAnswer }) => {
  const question = await QuestionSchema.create({
    questionText,
    chapterId,
    description,
    quesOptions,
    quesAnswer,
  });
  return question;
};

const addQuestions = async ({ questions }) => {
  const questionsCreated = await QuestionSchema.insertMany(questions);
  return questionsCreated;
};

const getChapterQuestionById = async ({ chapterId }) => {
  const modNo = Number(chapterId);
  const questions = await QuestionSchema.find(
    { chapterId: modNo },
    { quesAnswer: 0 }
  );
  return questions;
};

const getChaptersDetailsByID = async ({ chapterId }) => {
  const modNo = Number(chapterId);
  let chapter = await Chapter.find({ customIndex: modNo });
  if (!chapter || chapter.length === 0) {
    chapter = chaptersData.filter((c) => c.customIndex === modNo);
  }
  return chapter;
};

const getAllChaptersDetails = async () => {
  let chapters = await Chapter.find().sort({ customIndex: 1 });
  if (!chapters || chapters.length === 0) {
    chapters = chaptersData;
  }
  return chapters;
};

module.exports = {
  getAllChaptersDetails,
  createChapter,
  getChapterQuestionById,
  addQuestion,
  addQuestions,
  getChaptersDetailsByID,
};
