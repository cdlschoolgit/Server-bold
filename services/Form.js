const catchAsyncErrors = require('../middlewares/catchAsyncError');
const FormSchema = require('../models/Form');
const Student = require('../models/Student');
const { makeStudentActiveById } = require('./Teacher');
const createFormData = catchAsyncErrors(
  async ({
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
    const FormData = await FormSchema.create({
      name: name,
      phoneNumber: phoneNum,
      address: address,
      gender: gender,
      email: email,
      studentId: studentId,
      dob: dob,
      socialSecurity: socialSociety,
      transmission: transmission,
    });
    if (FormData) {
      const student = await Student.findById(studentId);
      student.isAgreement = true;
      student.isDataCollected = true;
      student.isEnrolled = true;
      await student.save();
      return true;
    } else return false;
  }
);

const approveFormData = catchAsyncErrors(
  async ({ studentId, formId, checkedBy, checkedBySign }) => {
    const formData = await FormSchema.findById(formId);
    if (formData) {
      formData.checkedBy = checkedBy;
      formData.checkedAt = Date.now();
      formData.checkedBySign = checkedBySign || 'Mirza Arslan';
      formData.status = 'ACCEPTED';
      await formData.save();

      const student = await Student.findById(studentId);
      student.isFormApproved = true;
      student.isStudent = true;

      await student.save();
      await makeStudentActiveById({ studentId, teacherId: checkedBy });

      return true;
    } else return false;
  }
);
const getAllFormData = catchAsyncErrors(async () => {
  const allForms = await FormSchema.find({}, null, {
    sort: { name: 'asc' },
  });
  return allForms;
});

const FormById = catchAsyncErrors(async ({ id }) => {
  const form = await FormSchema.findById(id);
  if (!form) return null;
  return form;
});

const FormByStudentId = catchAsyncErrors(async ({ studentId }) => {
  const form = await FormSchema.find({ studentId: studentId });
  if (!form) return null;
  return form;
});
const formsByTerm = catchAsyncErrors(async ({ term }) => {
  const forms = [];
  const allForms = await FormSchema.find({}, null, {
    sort: { name: 'asc' },
  });
  for (let i = 0; i < allForms.length; i++) {
    if (allForms[i].name.toLowerCase().includes(term.toLowerCase()))
      forms.push(allForms[i]);
  }
  // console.log(students);
  return forms;
});
const editFormData = catchAsyncErrors(
  async ({
    formId,
    name,
    address,
    phoneNum,
    dob,
    socialSociety,
    gender,
    transmission,
    // ModifiedId,
  }) => {
    const form = await FormSchema.findById(formId);
    if (!form) return null;
    else {
      form.name = name;
      form.address = address;
      form.phoneNumber = phoneNum;
      form.dob = dob;
      form.socialSecurity = socialSociety;
      form.gender = gender;
      form.transmission = transmission;
      await form.save();
      return true;
    }
  }
);
module.exports = {
  createFormData,
  editFormData,
  approveFormData,
  FormById,
  getAllFormData,
  FormByStudentId,
  formsByTerm,
};
