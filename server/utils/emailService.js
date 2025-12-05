// Email service utility
// In production, you'd use a service like SendGrid, AWS SES, or Nodemailer with SMTP

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML content
 * @param {string} [options.text] - Plain text content
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    // Check if email service is configured
    if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED !== 'true') {
        console.log('📧 Email service not configured. Email would be sent:');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log('   Enable by setting EMAIL_ENABLED=true and configuring SMTP settings');
        return { success: true, simulated: true };
    }

    // Example integration with Nodemailer (uncomment and configure as needed)
    /*
    import nodemailer from 'nodemailer';

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Squadly <noreply@squadly.app>',
        to,
        subject,
        html,
        text
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    */

    // For now, log the email (simulated)
    console.log('📧 Simulating email send:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);

    return { success: true, simulated: true };
};

// Template helpers
export const emailTemplates = {
    /**
     * Password reset email template
     * @param {string} name - User's name
     * @param {string} resetUrl - Password reset URL
     */
    passwordReset: (name, resetUrl) => ({
        subject: 'Squadly - Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">Squadly</h1>
                </div>
                <h2 style="color: #1f2937;">Password Reset Request</h2>
                <p style="color: #4b5563;">Hello ${name},</p>
                <p style="color: #4b5563;">You requested to reset your password. Click the button below to reset it:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="color: #6366f1; word-break: break-all;">${resetUrl}</p>
                <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
                <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">This email was sent from Squadly</p>
            </div>
        `
    }),

    /**
     * Welcome email template
     * @param {string} name - User's name
     */
    welcomeEmail: (name) => ({
        subject: 'Welcome to Squadly! 🎉',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">Squadly</h1>
                </div>
                <h2 style="color: #1f2937;">Welcome to Squadly, ${name}! 🎉</h2>
                <p style="color: #4b5563;">We're excited to have you on board. Squadly helps you:</p>
                <ul style="color: #4b5563;">
                    <li>Plan trips with friends</li>
                    <li>Track and split expenses</li>
                    <li>Organize events and projects</li>
                    <li>Stay connected with your squad</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get Started</a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">This email was sent from Squadly</p>
            </div>
        `
    }),

    /**
     * Notification email template
     * @param {string} name - User's name
     * @param {Object} notification - Notification object
     * @param {string} notification.title - Notification title
     * @param {string} notification.message - Notification message
     */
    notificationEmail: (name, notification) => ({
        subject: `Squadly - ${notification.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #6366f1; margin: 0;">Squadly</h1>
                </div>
                <h2 style="color: #1f2937;">${notification.title}</h2>
                <p style="color: #4b5563;">Hello ${name},</p>
                <p style="color: #4b5563;">${notification.message}</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in App</a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">This email was sent from Squadly</p>
            </div>
        `
    })
};

