const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config(); // Ensure you have a .env file with your environment variables

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
      user: process.env.SMTP_FROM_EMAIL, // Your email address from environment variable
      pass: process.env.SMTP_PASSWORD, // Your email password from environment variable
    },
  });

  transporter.use('compile', hbs(handlebarOptions));

  const message = {
    from: `"United-CDL-School" <${process.env.SMTP_FROM_EMAIL}>`, 
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
