const mongoose = require('mongoose');
const ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter name'],
  },
  videoLink: {
    type: String,
  },
  videoLinks: {
    type: [String],
  },
  customIndex: {
    type: Number,
    required: [true, 'please Provde the Cusom Index'],
  },
  description: {
    type: String,
    required: [true, 'please enter description'],
    maxlength: [80, 'Course Name cannot exceed 80 charachters'],
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('Chapter', ChapterSchema);
