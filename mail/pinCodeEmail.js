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
      user: "support@unitedeldt.com",
      pass: "pmtq ljxh ffta uxx",
    },
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

  const mailSent = await transporter.sendMail(message);
  console.log(mailSent);
};

module.exports = notifyEmail;
