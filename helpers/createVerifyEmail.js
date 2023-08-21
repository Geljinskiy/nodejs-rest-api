import dotenv from "dotenv";

dotenv.config();

const { BASE_URL } = process.env;

const createVerifyEmail = ({ email, verificationToken }) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click here to confirm your email</a>`,
  };

  return verifyEmail;
};

export default createVerifyEmail;
