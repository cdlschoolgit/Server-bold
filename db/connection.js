const logger = require('../utils/logger');
const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      // dbName: "Traffic-Assessment",
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then((con) => {
      logger.info(`Database is connected on ${con.connection.host}`);
    })
    .catch((e) => logger.error(e));
};
module.exports = connectDatabase;
