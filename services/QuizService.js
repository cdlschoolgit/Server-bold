const QuestionSchema = require('../models/Question');
const Chapter = require('../models/Chapter');
const chaptersData = require('../data/chapters.json');
const defaultQuestions = require('../data/questions.json');

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
    chapterId: Number(chapterId),
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
  let questions = await QuestionSchema.find(
    { chapterId: modNo },
    { quesAnswer: 0 }
  );
  if (!questions || questions.length === 0) {
    // Fallback if seeder hasn't been run yet
    questions = defaultQuestions
      .filter((q) => Number(q.chapterId) === modNo)
      .map(({ quesAnswer, ...rest }) => rest);
  }
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

// Admin question operations (including correct answers)
const getAllQuestionsWithAnswers = async (filter = {}) => {
  let query = {};
  if (filter.chapterId) {
    query.chapterId = Number(filter.chapterId);
  }
  if (filter.search) {
    query.questionText = { $regex: filter.search, $options: 'i' };
  }

  let count = await QuestionSchema.countDocuments();
  if (count === 0) {
    try {
      await QuestionSchema.insertMany(defaultQuestions);
      console.log('Auto-seeded questions into database');
    } catch (e) {
      console.error('Error auto-seeding questions:', e);
    }
  }

  const questions = await QuestionSchema.find(query).sort({ chapterId: 1, _id: 1 });
  return questions;
};

const updateQuestionById = async (id, data) => {
  const { questionText, chapterId, quesOptions, quesAnswer } = data;
  const updated = await QuestionSchema.findByIdAndUpdate(
    id,
    {
      $set: {
        questionText,
        chapterId: Number(chapterId),
        quesOptions,
        quesAnswer,
      },
    },
    { new: true, runValidators: true }
  );
  return updated;
};

const createQuestion = async (data) => {
  const { questionText, chapterId, quesOptions, quesAnswer } = data;
  const created = await QuestionSchema.create({
    questionText,
    chapterId: Number(chapterId),
    quesOptions,
    quesAnswer,
  });
  return created;
};

const deleteQuestionById = async (id) => {
  const deleted = await QuestionSchema.findByIdAndDelete(id);
  return deleted;
};

module.exports = {
  getAllChaptersDetails,
  createChapter,
  getChapterQuestionById,
  addQuestion,
  addQuestions,
  getChaptersDetailsByID,
  getAllQuestionsWithAnswers,
  updateQuestionById,
  createQuestion,
  deleteQuestionById,
};
