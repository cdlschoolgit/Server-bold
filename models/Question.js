const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'please enter name'],
  },
  chapterId: {
    type: Number,
    required: [true, 'please enter  Chapter Number'],
  },
  quesOptions: {
    type: [String],
    require: [true, 'please Enter the Question Option'],
  },
  quesAnswer: {
    type: String,
    require: [true, "please Enter the Question's Answer"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('Question', QuestionSchema);
