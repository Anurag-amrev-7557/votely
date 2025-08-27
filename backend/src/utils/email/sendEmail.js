const nodemailer = require('nodemailer');

// Check if email configuration is available
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

// Create transporter only if configuration is available
let transporter = null;
if (isEmailConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.warn('Failed to create email transporter:', error.message);
    transporter = null;
  }
}

async function sendEmail({ to, subject, text, html }) {
  // If email is not configured, just log and return successfully
  if (!transporter || !isEmailConfigured()) {
    console.log('Email not configured, skipping email send:', { to, subject });
    return Promise.resolve();
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw error, just log it
    return Promise.resolve();
  }
}

module.exports = sendEmail; 