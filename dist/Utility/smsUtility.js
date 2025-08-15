require('dotenv').config();
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);
// Function to send SMS
const sendSMS = (to, message) => {
    return new Promise((resolve, reject) => {
        client.messages.create({
            body: message,
            to: to,
            from: fromNumber
        })
            .then((message) => {
            console.log(`Message sent with SID: ${message.sid}`);
            resolve(message);
        })
            .catch((error) => {
            console.error('Error sending message:', error);
            reject(error);
        });
    });
};
module.exports = {
    sendSMS,
};
