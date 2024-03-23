const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please enter Student Id'],
    ref: 'Student',
  },
  name: {
    type: String,
    required: [true, 'please enter name'],
  },
  address: {
    type: String,
    required: [true, 'please enter address'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'please enter phone number'],
  },
  socialSecurity: {
    type: String,
    required: [true, 'please enter socialSecurity'],
  },
  email: {
    type: String,
    required: [true, 'please enter email'],
  },
  gender: {
    type: String,
    required: [true, 'please enter gender'],
  },
  transmission: {
    type: String,
    required: [true, 'please enter transmission'],
  },
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  checkedBySign: {
    type: String,
  },
  status: {
    type: String,
    default: 'PENDING',
    // PENDING, REJECTED, ACCEPTED
  },
  dob: {
    type: Date,
  },
  checkedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Form', FormSchema);
