const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // Fallback to gmail if not specified
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 * @param {string} options.text - Email body (Text fallback)
 */
const sendEmail = async ({ to, subject, html, text }) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Votely Admin" <noreply@votely.app>',
        to,
        subject,
        html,
        text
    };

    // Use mock mode if NOT production OR if credentials missing
    if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_USER) {
        console.log('--- MOCK EMAIL SEND ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text || '(html content)'}`);

        // Write the latest magic link to a file for easy access
        if (text && text.includes('http')) {
            const fs = require('fs');
            const path = require('path');
            const linkMatch = text.match(/http[s]?:\/\/[^\s]+/);
            if (linkMatch) {
                try {
                    fs.writeFileSync(path.join(__dirname, '../../last_magic_link.txt'), linkMatch[0]);
                    console.log(' (Magic Link written to backend/last_magic_link.txt) ');
                } catch (e) {
                    console.error('Failed to write magic link to file:', e);
                }
            }
        }

        console.log('-----------------------');
        return { message: 'Mock email sent' };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Send Magic Link Email
 * @param {string} email - User email
 * @param {string} link - Magic link URL
 */
const sendMagicLinkEmail = async (email, link) => {
    const subject = 'Your Login Link for Votely';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Login to Votely</h2>
      <p>You requested a secure login link. Click the button below to sign in:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign In</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666;">${link}</p>
      <p>This link will expire in 15 minutes.</p>
      <hr />
      <p style="font-size: 12px; color: #888;">If you didn't request this email, you can safely ignore it.</p>
    </div>
  `;
    const text = `Login to Votely\n\nClick here to sign in: ${link}\n\nThis link will expire in 15 minutes.`;

    return sendEmail({ to: email, subject, html, text });
};

module.exports = {
    sendEmail,
    sendMagicLinkEmail
};
