import 'dotenv/config'; // Loads .env immediately
import { sendEmail } from './utils/emailService.js';

console.log('Testing email sending...');
console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '****' : 'MISSING'
});

sendEmail({
    to: 'neurasparkllc@gmail.com',
    subject: 'Test Email from Squadly',
    html: '<p>This is a test email to verify SMTP configuration.</p>'
}).then(() => {
    console.log('Email test initiated.');
});
