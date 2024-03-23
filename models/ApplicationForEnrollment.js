const mongoose = require('mongoose');
const ApplicationForEnrollmentModel = new mongoose.Schema({
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
  EmergancyContactName: {
    type: String,
    required: [true, 'please enter Emergancy Contact Name'],
  },
  EmergancyPhone: {
    type: String,
    required: [true, 'please enter Emergancy Phone'],
  },
  EmergancyRelation: {
    type: String,
    required: [true, 'please enter Emergancy Relation'],
  },
  EmergancyAddress: {
    type: String,
    required: [true, 'please enter Emergancy Address'],
  },
  EducationHighestGradeCompleted: {
    type: String,
    required: [true, 'please enter Highest Grade Completed'],
  },
  MotorVehicleLicense: {
    type: String,
    required: [true, 'please enter Motor Vehicle License'],
  },
  MotorLicenseState: {
    type: String,
    required: [true, 'please enter Motor License State'],
  },
  dateOfSign: {
    type: Date,
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
    type: String,
  },
});

module.exports = mongoose.model(
  'ApplicationForEnrollment',
  ApplicationForEnrollmentModel
);
