const logger = require('../utils/logger');
const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
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
