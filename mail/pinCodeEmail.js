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

const notifyEmail = async (options) => {
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
    template: 'pinCode',
    context: {
      userName: options.name,
      pinCode: options.pinCode,
      email: options.email,
    },
  };

  try {
    const mailSent = await transporter.sendMail(message);
    console.log('Email sent:', mailSent);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = notifyEmail;
