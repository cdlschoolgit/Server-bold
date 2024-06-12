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
    console.log('Email sent:', mailSent);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
