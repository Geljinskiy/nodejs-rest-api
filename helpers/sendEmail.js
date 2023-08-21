import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import HttpError from "./httpError.js";

dotenv.config();

const { SEND_GRID_API_KEY, SEND_EMAIL_ADRESS } = process.env;

sgMail.setApiKey(SEND_GRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const msg = { ...data, from: SEND_EMAIL_ADRESS };
    console.log("msg :", msg);
    await sgMail.send(msg);
  } catch (error) {
    throw HttpError(error);
  }
};

export default sendEmail;
