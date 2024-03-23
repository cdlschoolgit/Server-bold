const catchAsyncErrors = require('../middlewares/catchAsyncError');

const DataCollection = require('../models/DataCollectionForm');
const Student = require('../models/Student');

const createDataCollection = catchAsyncErrors(
  async ({
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
  }) => {
    const dataCollectionObj = await DataCollection.create({
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
      status: 'PENDING',
    });
    const studentById = await Student.findById(studentId);
    studentById.isDataCollected = true;
    await studentById.save();

    return dataCollectionObj;
  }
);
const getBasicInfoByEmail = catchAsyncErrors(async (email) => {
  const dataCollected = await DataCollection.find(
    { studentId: email },
    {
      status: 0,
      applicantSign: 0,
      race: 0,
      createAt: 0,
      dateOfSign: 0,
      checkedBy: 0,
      checkedAt: 0,
      checkedBySign: 0,
      checkedByName: 0,
      hispanicOrigin: 0,
      militaryVeteran: 0,
      disablePerson: 0,
    }
  );
  return dataCollected;
});

const getDataCollectionById = catchAsyncErrors(async () => {});
const getDataCollectionByName = catchAsyncErrors(async () => {});
const getDataCollectionByEmail = catchAsyncErrors(async (email) => {
  const dataCollected = await DataCollection.find({ studentId: email });
  return dataCollected;
});
const getDataCollectionAll = catchAsyncErrors(async () => {
  const dataCollected = await DataCollection.find();
  return dataCollected;
});

const approveDataCollectionForm = catchAsyncErrors(
  async ({ adminId, studentEmail, adminName }) => {
    const form = await DataCollection.find({ email: studentEmail });
    if (form.length > 0) {
      form[0].checkedAt = new Date();
      form[0].checkedBy = adminId;
      form[0].checkedByName = adminName;
      form[0].checkedBySign = adminName;
      form[0].status = 'ACCEPTED';
      await form[0].save();
      return form[0];
    } else return null;
  }
);
const rejectDataCollectionForm = catchAsyncErrors(async () => {});
module.exports = {
  createDataCollection,
  getDataCollectionById,
  getDataCollectionByEmail,
  getDataCollectionByName,
  getBasicInfoByEmail,
  approveDataCollectionForm,
  rejectDataCollectionForm,
  getDataCollectionAll,
};
