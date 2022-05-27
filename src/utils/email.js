const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendWelcomeEmail = (user) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: user.email,
    subject: "Task Manager",
    text: `Welcome, ${user.name} to Task Manager app. Please feel free to reply to this email for any feedback.`,
  };
  sendMail(mailOptions);
};

const sendCancellationEmail = (user) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: user.email,
    subject: "Task Manager",
    text: `Sorry to see you go ${user.name}. Please, tell us what could we have done better to fulfill your requirement.`,
  };
  sendMail(mailOptions);
};

const sendMail = (mailOptions) => {
  transport.sendMail(mailOptions, () => {
    if (error) console.log(error);
  });
};

module.exports = { sendCancellationEmail, sendWelcomeEmail };
