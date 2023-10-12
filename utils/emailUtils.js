const AWS = require('aws-sdk');

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

function sendEmail(recipient, subject, message) {
    const params = {
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: 'info@yaslanding.com',
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent successfully:', data);
        }
    });
}

module.exports = { sendEmail };
