const mongoose = require('mongoose');
const StudentResult = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'please enter name'],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please enter Id'],
    ref: 'Student',
  },

  /**
   *
   *  inner Objects : {moduleName: "", marks: 90, percentage: 90%, attemptedAt: new Date()}
   *
   * */
  overAllPercentage: {
    type: Number,
    default: 0,
  },
  lessonCompletedTotal: {
    type: Number,
    default: 0,
  },
  lastCompleted: {
    type: Number,
  },
});
module.exports = mongoose.model('StudentResult', StudentResult);
