const logger = require('../utils/logger');
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom dns is not allowed in runtime
}

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
