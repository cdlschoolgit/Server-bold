const DataCollection = require('../models/DataCollectionForm');
const Student = require('../models/Student');

const createDataCollection = async ({
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
    email: (email || '').toLowerCase().trim(),
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
  if (studentById) {
    studentById.isDataCollected = true;
    await studentById.save();
  }

  return dataCollectionObj;
};

const getBasicInfoByEmail = async (email) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const dataCollected = await DataCollection.find(
    { $or: [{ email: cleanEmail }, { studentId: email }] },
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
};

const getDataCollectionById = async (id) => {
  return await DataCollection.findById(id);
};

const getDataCollectionByName = async (name) => {
  return await DataCollection.find({ name });
};

const getDataCollectionByEmail = async (email) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const dataCollected = await DataCollection.find({
    $or: [{ email: cleanEmail }, { studentId: email }],
  });
  return dataCollected;
};

const getDataCollectionAll = async () => {
  const dataCollected = await DataCollection.find();
  return dataCollected;
};

const approveDataCollectionForm = async ({ adminId, studentEmail, adminName }) => {
  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const form = await DataCollection.find({ email: cleanEmail });
  if (form.length > 0) {
    form[0].checkedAt = new Date();
    form[0].checkedBy = adminId;
    form[0].checkedByName = adminName;
    form[0].checkedBySign = adminName;
    form[0].status = 'ACCEPTED';
    await form[0].save();
    return form[0];
  }
  return null;
};

const rejectDataCollectionForm = async () => {};

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
