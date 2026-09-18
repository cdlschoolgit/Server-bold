const logger = require('../utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

let isConnected = false;

const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  const dbUri = process.env.DB_URI || process.env.DB_LOCAL_URI;
  if (!dbUri) {
    logger.error('Database connection URI not defined');
    return;
  }

  try {
    const con = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    logger.info(`Database connected on ${con.connection.host}`);
    return con;
  } catch (error) {
    logger.error('Error connecting to the database:', error);
  }
};

module.exports = connectDatabase;
