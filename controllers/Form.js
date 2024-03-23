const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  createFormData,
  getAllFormData,
  FormByStudentId,
  editFormData,
  approveFormData,
  formsByTerm,
} = require('../services/Form');
const ErrorHandler = require('../utils/errorHandler');

exports.makeFormData = catchAsyncErrors(async (req, res, next) => {
  const {
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email,
    gender,
    transmission,
  } = req.body;

  const result = await createFormData({
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email,
    gender,
    transmission,
  });
  if (result) {
    res.status(200).json({
      success: true,
      message: 'Form data is submitted',
    });
  } else throw new ErrorHandler('There was error in filling Form', 400);
});

exports.getAllForms = catchAsyncErrors(async (req, res, next) => {
  const forms = await getAllFormData();
  res.status(200).json({
    success: true,
    forms,
  });
});
exports.getAllFormsByTerm = catchAsyncErrors(async (req, res, next) => {
  const { term } = req.params;
  if (!term) {
    throw new ErrorHandler('please Provide Term ');
  }
  const forms = await formsByTerm({ term });
  res.status(200).json({
    success: true,
    forms,
  });
});

exports.getFormDataByStudentId = catchAsyncErrors(async (req, res, next) => {
  const { studentId } = req.params;
  const forms = await FormByStudentId({ studentId });
  if (forms)
    res.status(200).json({
      success: true,
      forms,
    });
  else
    res.status(200).json({
      success: false,
    });
});
exports.checkForm = catchAsyncErrors(async (req, res, next) => {
  const { studentId, formId, checkedBy, checkedBySign } = req.body;
  if (studentId && formId && checkedBy && checkedBySign) {
    const result = await approveFormData({
      studentId,
      formId,
      checkedBy,
      checkedBySign,
    });
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Form is Checked',
      });
    } else throw new ErrorHandler('There was error in editing Form', 404);
  } else throw new ErrorHandler('Please Provide Form data', 400);
});

exports.editForm = catchAsyncErrors(async (req, res, next) => {
  const {
    formId,
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email,
    gender,
    transmission,
    ModifiedId,
  } = req.body;
  {
    const result = await editFormData({
      formId,
      studentId,
      name,
      address,
      phoneNum,
      dob,
      socialSociety,
      email,
      gender,
      transmission,
      ModifiedId,
    });
    if (result)
      res.status(200).json({
        success: true,
        message: 'Form is modified',
      });
    else throw new ErrorHandler('There was error in editing Form', 404);
  }
});
