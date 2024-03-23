const logger = require('../utils/logger');
const mongoose = require('mongoose');

const connectDatabase = () => {
  const dbUri = process.env.DB_URI;
  if (!dbUri) {
    logger.error('MongoDB connection URI is missing. Check the DB_URI environment variable.');
    return;
  }

  mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      logger.info(`Database connected on ${con.connection.host}`);
    })
    .catch((error) => {
      logger.error('Error connecting to the database:', error);
    });
};

module.exports = connectDatabase;
