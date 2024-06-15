const twilio = require('twilio');

const verifyOtp = async (mobileNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_SERVICE_SID;
  const client = twilio(accountSid, authToken);

  try {
    const verificationCheck = await client.verify.services(serviceSid)
      .verificationChecks
      .create({ to: `+91${mobileNumber}`, code: otp });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Failed to verify OTP', error);
    return false;
  }
};

module.exports = { verifyOtp };
