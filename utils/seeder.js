const dotenv = require('dotenv');

const connectDatabase = require('../db/connection');

const questions = require('../data/questions.json');
const QuestionSchema = require('../models/Question');
const Chapter = require('../models/Chapter');
const chapters = require('../data/chapters.json');
const logger = require('./logger');
dotenv.config({ path: './config/config.env' });

connectDatabase();
const seedProducts = async () => {
  try {
    logger.info('The Sample Data insertion started ');

    try {
      await Chapter.deleteMany();
      await QuestionSchema.deleteMany();
      await Chapter.insertMany(chapters);
      await QuestionSchema.insertMany(questions);
      logger.info('==================================');
      logger.info('The Sample Data insertion Completed ');
    } catch (e) {
      console.log(e);
    }

    process.exit();
  } catch (err) {
    // console.log(err);
    process.exit();
  }
};

seedProducts();
