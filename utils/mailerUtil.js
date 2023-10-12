const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-2.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MailerSmtpUser,
        pass: process.env.MailerPass
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'contact@yaslanding.com',
        to: to,
        subject: subject,
        text: text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

module.exports = { sendEmail };
