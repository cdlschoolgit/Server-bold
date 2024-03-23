const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const logger = require('../utils/logger');
const crypto = require('crypto');

const Student = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter name'],
    maxlength: [30, 'Your Name cannot exceed 20 charachters'],
  },
  profile: {
    type: String,
    default: 'https://united-cdl-school.s3.amazonaws.com/assets/avatar.jpg',
  },
  email: {
    type: String,
    required: [true, 'please enter email'],
    maxlength: [40, 'Your Email cannot exceed 30 charachters'],
    unique: [true, 'alreadt Account with Email'],
  },
  password: {
    type: String,
    required: [true, 'please enter password'],
    minlength: [6, 'Your password can not be  less then charachters'],
    select: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  docsUploaded: {
    type: Boolean,
    default: false,
  },
  isStudent: {
    type: Boolean,
    default: false,
  },
  isDataCollected: {
    type: Boolean,
    default: false,
  },
  isFormApproved: {
    type: Boolean,
    default: false,
  },
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  isAgreement: {
    type: Boolean,
    default: false,
  },

  docs: [],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  passwordForgot: {
    type: Number,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: { type: Date, default: null },
});

Student.pre('save', async function (next) {
  // if (!this.isModified("password")) {
  //   next();
  // }
  // this.password = await bcrypt.hash(this.password, 10);
});
Student.pre('validate', async function (next) {
  // logger.warn("validating Student Obj");
});

Student.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

Student.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('Student', Student);
