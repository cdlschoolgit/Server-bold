const catchAsyncErrors = require('../middlewares/catchAsyncError');
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  requestsByCourseId,
  requestsByTeacherId,
  requestsUnEnrollByTeacherId,
} = require('../services/Course');
const ErrorHandler = require('../utils/errorHandler');

exports.createCourseWithDetails = catchAsyncErrors(async (req, res, next) => {
  const { name, description, createdBy } = req.body;
  if (!name || !description || !createdBy) {
    return next(new ErrorHandler('Please Enter course Data', 400));
  }
  const course = await createCourse(name, description, createdBy);
  res.status(200).json({
    success: true,
    courses: course,
  });
});

exports.updateCourseWithDetails = catchAsyncErrors(async (req, res, next) => {
  const { name, description, courseId } = req.body;
  if (!name || !description || !courseId) {
    return next(new ErrorHandler('Please Enter course Data', 400));
  }
  const course = await updateCourse(courseId, name, description);
  res.status(200).json({
    success: true,
    courses: course,
  });
});

exports.deleteCourses = catchAsyncErrors(async (req, res, next) => {});

exports.getCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await getAllCourses();
  res.status(200).json({
    success: true,
    courses: courses,
  });
});

exports.getCourseInfo = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await getCourseById(courseId);
  if (course == null) {
    return next(new ErrorHandler('Course Not Found', 404));
  } else {
    res.status(200).json({
      success: true,
      user: course,
    });
  }
});

exports.requestsUnEnrollByTeacher = catchAsyncErrors(async (req, res, next) => {
  const { teacherId } = req.params;
  const requests = await requestsUnEnrollByTeacherId(teacherId);
  if (requests == null) {
    return next(new ErrorHandler('Course Not Found', 404));
  } else {
    res.status(200).json({
      success: true,
      requests,
    });
  }
});

exports.requestsByTeacher = catchAsyncErrors(async (req, res, next) => {
  const { teacherId } = req.params;
  const requests = await requestsByTeacherId(teacherId);
  if (requests == null) {
    return next(new ErrorHandler('Course Not Found', 404));
  } else {
    res.status(200).json({
      success: true,
      requests,
    });
  }
});

exports.requestsByCourse = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await requestsByCourseId(courseId);
  if (course == null) {
    return next(new ErrorHandler('Course Not Found', 404));
  } else {
    res.status(200).json({
      success: true,
      user: course,
    });
  }
});
