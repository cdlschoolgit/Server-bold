const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  createDataCollection,
  getDataCollectionByName,
  getDataCollectionById,
  getDataCollectionByEmail,
  approveDataCollectionForm,
  getBasicInfoByEmail,
  rejectDataCollectionForm,
  getDataCollectionAll,
} = require('../services/DataCollection');
const ErrorHandler = require('../utils/errorHandler');
exports.getBasicInfo = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;
  const dataCollected = await getBasicInfoByEmail(email);
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('Data Collection  Not Found', 404));
  }
});
exports.makeDataCollection = catchAsyncErrors(async (req, res, next) => {
  const {
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email,
    race,
    gender,
    hispanicOrigin,
    militaryVeteran,
    disablePerson,
    HighestGradeCompleted,
    dateOfSign,
    applicantSign,
  } = req.body;
  const dataCollected = await createDataCollection({
    studentId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    email,
    race,
    gender,
    hispanicOrigin,
    militaryVeteran,
    disablePerson,
    HighestGradeCompleted,
    dateOfSign,
    applicantSign,
  });
  if (dataCollected) {
    res.status(200).json({
      success: true,
      message: 'Data Collected Successfully',
    });
  } else {
    return next(new ErrorHandler('Error in Data Collection ', 400));
  }
});
exports.getDataCollectionByEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;
  const dataCollected = await getDataCollectionByEmail(email);
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('Data Collection  Not Found', 404));
  }
});
exports.allDataCollected = catchAsyncErrors(async (req, res, next) => {
  const collections = await getDataCollectionAll();
  res.status(200).json({
    success: true,
    collections,
  });
});
exports.approveDataCollection = catchAsyncErrors(async (req, res, next) => {
  const { name, id, student } = req.body;
  const dataCollected = await approveDataCollectionForm({
    adminId: id,
    studentEmail: student,
    adminName: name,
  });
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('Data Collection  Not Found', 404));
  }
});

exports.rejectDataCollection = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const dataCollected = await rejectDataCollectionForm({ email });
  if (dataCollected) {
    res.status(200).json({
      success: true,
      dataCollected,
    });
  } else {
    return next(new ErrorHandler('Data Collection  Not Found', 404));
  }
});
