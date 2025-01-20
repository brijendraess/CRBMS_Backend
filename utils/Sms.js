import twilio from "twilio";
// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Replace with your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Replace with your Auth Token
const client = new twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message, // SMS content
      to,
      from: process.env.TWILIO_REGISTERED_NUMBER_FROM,
    });

    console.log("Message sent successfully:", response.sid);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

export { sendSMS };
