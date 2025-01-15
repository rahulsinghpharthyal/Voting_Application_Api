import axios from 'axios';

const verifyRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;
  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is missing" });
  }
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const { success } = response.data;
    console.log('this is success', success);
    if (!success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "reCAPTCHA verification error", error });
  }
};

export default verifyRecaptcha;
