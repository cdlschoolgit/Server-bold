// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('MongoDB connection error:', error);
});

// Define a route to check if the database is connected
app.get('/api/dbstatus', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    // Ready state 1 indicates connected
    res.status(200).json({ status: 'Database connected' });
  } else {
    res.status(500).json({ status: 'Database connection failed' });
  }
});

// Define a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
