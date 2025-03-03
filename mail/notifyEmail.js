const nodemailer = require('nodemailer');
const path = require('path');

var hbs = require('nodemailer-express-handlebars');

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
    template: 'notify',
    context: {
      userName: options.name,
      emailAddress: options.email,
      password: options.password,
    },
  };

  const mailSent = await transporter.sendMail(message);
  console.log(mailSent);
};

module.exports = notifyEmail;
