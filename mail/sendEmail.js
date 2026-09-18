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
  const user = process.env.SMTP_USER || 'login@unitedeldt.com';
  const pass = process.env.SMTP_PASSWORD || 'kqdh tfza wzzg jldm';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
    debug: process.env.NODE_ENV !== 'PRODUCTION',
  });

  transporter.use('compile', hbs(handlebarOptions));

  console.log('Sending email to:', options.email);

  const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@unitedeldt.com';
  const fromName = process.env.SMTP_FROM_NAME || 'United CDL Training School';

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    template: 'email',
    context: {
      userName: options.userName,
      emailAddress: options.email,
      verifyURL: options.verifyURL,
      year: new Date().getFullYear(),
    },
  };

  try {
    const mailSent = await transporter.sendMail(message);
    console.log('Email sent successfully:', mailSent?.messageId);
    return mailSent;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
};

module.exports = sendEmail;
