const mongoose = require('mongoose');
const Course = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter name'],
    maxlength: [40, 'Course Name cannot exceed 20 charachters'],
  },
  description: {
    type: String,
    required: [true, 'please enter description'],
    maxlength: [80, 'Course Name cannot exceed 80 charachters'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please provide Creator Id'],
    ref: 'AdminSimple',
  },
  creatorName: {
    type: String,
    required: [true, 'please enter name of Course Creator  '],
  },

  enrolledStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
  },
  requestForEnrollment: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
  },
  requestForUnenroll: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Student',
  },

  completed: {
    type: Boolean,
    default: false,
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
module.exports = mongoose.model('Course', Course);
