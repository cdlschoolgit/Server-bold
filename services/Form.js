const FormSchema = require('../models/Form');
const Student = require('../models/Student');
const StudentModuleResult = require('../models/StudentModuleResult');
const StudentResult = require('../models/StudentResult');

const createFormData = async ({
  studentId,
  name,
  address,
  phoneNum,
  dob,
  socialSociety,
  email,
  gender,
  transmission,
}) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  const FormData = await FormSchema.create({
    name: name,
    phoneNumber: phoneNum,
    address: address,
    gender: gender,
    email: cleanEmail,
    studentId: studentId,
    dob: dob,
    socialSecurity: socialSociety,
    transmission: transmission,
    status: 'PENDING',
  });

  if (FormData) {
    const student = await Student.findById(studentId);
    if (student) {
      student.isAgreement = true;
      student.isDataCollected = true;
      student.isEnrolled = true;
      await student.save();
    }
    return true;
  }
  return false;
};

const approveFormData = async ({ studentId, formId, checkedBy, checkedBySign }) => {
  const formData = await FormSchema.findById(formId);
  if (!formData) return false;

  formData.checkedBy = checkedBy;
  formData.checkedAt = Date.now();
  formData.checkedBySign = checkedBySign || 'Mirza Arslan';
  formData.status = 'ACCEPTED';
  await formData.save();

  const student = await Student.findById(studentId);
  if (student) {
    student.isFormApproved = true;
    student.isStudent = true;
    student.active = true;
    await student.save();

    // Ensure 35 modules exist for this student so modules page is never blank
    const { makeChaptersData } = require('./Student');
    const { createResult } = require('./StudentResult');

    const modules = await StudentModuleResult.find({ studentId: student._id });
    if (!modules || modules.length === 0) {
      await makeChaptersData({ studentId: student._id, studentName: student.name });
    }
    const overall = await StudentResult.findOne({ studentId: student._id });
    if (!overall) {
      await createResult({ studentName: student.name, studentId: student._id });
    }
  }

  return true;
};

const getAllFormData = async () => {
  const allForms = await FormSchema.find({}, null, {
    sort: { name: 'asc' },
  });
  return allForms;
};

const FormById = async ({ id }) => {
  const form = await FormSchema.findById(id);
  return form;
};

const FormByStudentId = async ({ studentId }) => {
  const form = await FormSchema.find({ studentId: studentId });
  return form;
};

const formsByTerm = async ({ term }) => {
  const cleanTerm = (term || '').toLowerCase();
  const allForms = await FormSchema.find({}, null, {
    sort: { name: 'asc' },
  });
  return allForms.filter((f) => (f.name || '').toLowerCase().includes(cleanTerm));
};

const editFormData = async ({
  formId,
  name,
  address,
  phoneNum,
  dob,
  socialSociety,
  gender,
  transmission,
}) => {
  const form = await FormSchema.findById(formId);
  if (!form) return null;

  form.name = name;
  form.address = address;
  form.phoneNumber = phoneNum;
  form.dob = dob;
  form.socialSecurity = socialSociety;
  form.gender = gender;
  form.transmission = transmission;
  await form.save();
  return true;
};

module.exports = {
  createFormData,
  editFormData,
  approveFormData,
  FormById,
  getAllFormData,
  FormByStudentId,
  formsByTerm,
};
