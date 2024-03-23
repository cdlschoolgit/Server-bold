const mongoose = require('mongoose');
const DataCollectionFormModel = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'please enter Student Id'],
    ref: 'Student',
  },
  name: {
    type: String,
    required: [true, 'please enter name'],
    maxlength: [30, 'Your Name cannot exceed 30 charachters'],
  },
  address: {
    type: String,
    required: [true, 'please enter address'],
    maxlength: [50, 'Your address cannot exceed 50 charachters'],
  },
  phoneNum: {
    type: String,
    required: [true, 'please enter phone'],
    maxlength: [15, ' phone cannot exceed 15 charachters'],
  },
  dob: {
    type: String,
    required: [true, 'please enter dob'],
    maxlength: [30, 'Your dob cannot exceed 15 charachters'],
  },
  socialSociety: {
    type: String,
    required: [true, 'please enter socialSociety'],
    maxlength: [20, 'Your socialSociety cannot exceed 20 charachters'],
  },
  email: {
    type: String,
    required: [true, 'please enter email'],
    maxlength: [40, 'Your Email cannot exceed 30 charachters'],
    unique: [true, 'alreadt Account with Email'],
  },
  race: {
    type: String,
    required: [true, 'please enter race'],
  },
  gender: {
    type: String,
    required: [true, 'please enter gender'],
  },
  hispanicOrigin: {
    type: String,
    default: false,
  },
  militaryVeteran: {
    type: String,
    default: false,
  },
  disablePerson: {
    type: String,
    default: false,
  },
  HighestGradeCompleted: {
    type: String,
    required: [true, 'please enter highest grade'],
  },
  dateOfSign: {
    type: String,
    required: [true, 'please enter sign date'],
  },
  applicantSign: {
    type: String,
    required: [true, 'please enter applicantSign'],
  },
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  checkedBySign: {
    type: String,
  },

  checkedByName: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: 'PENDING',
    // PENDING, REJECTED, ACCEPTED
  },
  checkedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('DataCollectionForm', DataCollectionFormModel);
