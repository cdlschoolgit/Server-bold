const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: '.hbs',
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'login@unitedeldt.com',
      pass: 'kqdh tfza wzzg jldm',
    },
    debug: true,
  });

  transporter.use('compile', hbs(handlebarOptions));

  // Logging that the email sending process has started
  console.log("Starting to send email...");

  const message = {
    from: `"United-CDL-School" <support@unitedeldt.com>`,
    to: options.email,
    subject: options.subject,
    template: 'email',
    context: {
      userName: options.userName,
      emailAddress: options.email,
      verifyURL: options.verifyURL,
    },
  };

  try {
    const mailSent = await transporter.sendMail(message);
    // Logging the success message with details
    console.log('Email sent successfully:', mailSent);
  } catch (error) {
    // Logging the error message if sending fails
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
