const fetch = require('node-fetch');

const verifyRecaptcha = async (recaptchaToken) => {
    const secretKey = 'YOUR_SECRET_KEY'; // Replace this with your actual secret key
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await fetch(verificationURL, {
        method: 'POST',
    });

    const responseData = await response.json();

    if (responseData.success) {
        // Here you can handle the successful verification
        console.log('reCAPTCHA verification successful!');
        return true;
    } else {
        // Handle the failure accordingly
        console.log('reCAPTCHA verification failed:', responseData['error-codes']);
        return false;
    }
};

// You can use the verifyRecaptcha function in your route handling logic
