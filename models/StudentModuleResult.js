const mongoose = require('mongoose');
const StudentModuleResult = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'please enter name'],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please enter Id'],
    ref: 'Student',
  },
  chapterNo: {
    type: Number,
    required: [true, 'please Enter Chapter No'],
  },
  chapterName: {
    type: String,
    required: [true, 'please Enter Chapter Name'],
  },
  videoPlayed: {
    type: Number,
    default: 0, // 15,30,45,60,75,90,100
  },
  percentage: {
    type: Number,
  },
  videoCompleted: {
    type: Boolean,
    default: false,
  },
  marks: {
    type: Number,
  },
  attempted: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    default: 'NOT_ATTEMPTED', // NOT_ATTEMPTED, VIDEO_COMPLETED, FAILED, PASSED
  },
});
module.exports = mongoose.model('StudentModuleResult', StudentModuleResult);
