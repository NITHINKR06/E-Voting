const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for E-Voting Verification',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };