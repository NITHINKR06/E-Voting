const nodemailer = require('nodemailer');

// Create transporter with fallback for development
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dev@example.com',
    pass: process.env.EMAIL_PASS || 'dev-password',
  },
});

const sendOTP = async (to, otp) => {
  console.log(`[EMAIL SERVICE] Attempting to send OTP to: ${to}`);
  console.log(`[EMAIL SERVICE] EMAIL_USER configured: ${!!process.env.EMAIL_USER}`);
  console.log(`[EMAIL SERVICE] EMAIL_PASS configured: ${!!process.env.EMAIL_PASS}`);
  
  // For development, just log the OTP instead of sending email
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV MODE] OTP for ${to}: ${otp}`);
    return;
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for E-Voting Verification',
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">E-Voting System</h2>
        <p>Your OTP for verification is:</p>
        <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px;">${otp}</span>
        </div>
        <p><strong>This OTP expires in 5 minutes.</strong></p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };
  
  try {
    console.log(`[EMAIL SERVICE] Sending email to ${to}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Email sent successfully! Message ID: ${result.messageId}`);
  } catch (error) {
    console.error('[EMAIL SERVICE] Email sending failed:', error.message);
    console.error('[EMAIL SERVICE] Full error:', error);
    // Don't throw error, just log it for development
    console.log(`[FALLBACK] OTP for ${to}: ${otp}`);
  }
};

module.exports = { sendOTP };