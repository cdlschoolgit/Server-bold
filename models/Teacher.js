const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const AdminSimple = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter name'],
    maxlength: [30, 'Your Name cannot exceed 20 charachters'],
  },
  email: {
    type: String,
    required: [true, 'please enter email'],
    maxlength: [40, 'Your Email cannot exceed 30 charachters'],
  },
  password: {
    type: String,
    required: [true, 'please enter password'],
    minlength: [8, 'Your password can not be  less then charachters'],
    select: false,
  },

  super: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  studentVerified: [],
  licenseVerified: [],
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
AdminSimple.pre('save', async function (next) {
  // logger.warn("before saving");
  // if (!this.isModified("password")) {
  //   next();
  // }
  // this.password = await bcrypt.hash(this.password, 10);
});
AdminSimple.pre('validate', async function (next) {
  logger.warn('validation');
});

AdminSimple.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('AdminSimple', AdminSimple);
// AdminSimple will be replaced with only admin
