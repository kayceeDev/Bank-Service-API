const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1. Create a transporter ( a service that sends the email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2. define the email options
  const mailOptions = {
    from: "Ekene Nwobodo <hellp@gmail.io",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
