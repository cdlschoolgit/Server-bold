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

const pinCodeEmail = async (options) => {
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

  const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@unitedeldt.com';
  const fromName = process.env.SMTP_FROM_NAME || 'United CDL Training School';

  const message = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject || 'Password Reset Pin Code - United CDL School',
    template: 'pinCode',
    context: {
      userName: options.name || options.userName,
      pinCode: options.pinCode,
      email: options.email,
      year: new Date().getFullYear(),
    },
  };

  try {
    const mailSent = await transporter.sendMail(message);
    console.log('Pin code email sent:', mailSent?.messageId);
    return mailSent;
  } catch (error) {
    console.error('Error sending pin code email:', error);
    return null;
  }
};

module.exports = pinCodeEmail;
