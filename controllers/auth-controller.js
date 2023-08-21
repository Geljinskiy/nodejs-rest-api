// libs imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import jimp from "jimp";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
// local imports
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";
import { User } from "../models/index.js";

dotenv.config();

const avatarsPath = path.resolve("public", "avatars");

const { JWT_PHRASE } = process.env;

const registration = async (req, res) => {
  const { email, password } = req.body;

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(
    email,
    { s: "250", r: "g", d: "wavatar" },
    false
  );
  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const msg = createVerifyEmail({ email, verificationToken });

  await sendEmail(msg);

  const { subscription } = await User.create({
    ...req.body,
    avatarURL,
    password: hashedPassword,
    verificationToken,
  });

  res.status(201).json({ user: { email, subscription } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }

  const { _id: userId, subscription } = user;

  const comparedPassword = bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: userId,
  };

  const token = jwt.sign(payload, JWT_PHRASE, { expiresIn: "23h" });

  await User.findByIdAndUpdate(userId, { token }, { new: true });

  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({ message: "Success" });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id: userId } = req.user;
  const { subscription } = req.body;

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  res.status(200).json(updateUser);
};

const updateAvatar = async (req, res) => {
  const { _id: userId } = req.user;
  const userIdString = userId.toString();
  if (!req.file) {
    throw HttpError(400, "no file found");
  }
  const { path: oldPath, filename, originalname } = req.file;

  if (
    path.extname(originalname) !== ".png" &&
    path.extname(originalname) !== ".jpg"
  ) {
    await fs.unlink(oldPath);
    throw HttpError(400, "incorrect file type (jpg and png only allowed)");
  }

  const image = await jimp.read(oldPath);

  image.cover(250, 250);

  await image.writeAsync(oldPath);

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(userId, { avatarURL });

  res.status(200).json({ avatarURL });
};

const verifycationByToken = async (req, res) => {
  const { verificationToken } = req.params;
  const isExist = await User.findOne({ verificationToken });
  if (!isExist) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(isExist._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const msg = createVerifyEmail({
    email,
    verificationToken: user.verificationToken,
  });

  await sendEmail(msg);

  res.status(200).json({ message: "Verification email sent" });
};

export default {
  registration: cntrllrWrapper(registration),
  login: cntrllrWrapper(login),
  logout: cntrllrWrapper(logout),
  current: cntrllrWrapper(current),
  updateSubscription: cntrllrWrapper(updateSubscription),
  updateAvatar: cntrllrWrapper(updateAvatar),
  verifycationByToken: cntrllrWrapper(verifycationByToken),
  resendVerifyEmail: cntrllrWrapper(resendVerifyEmail),
};
