// libs imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import jimp from "jimp";
import gravatar from "gravatar";
// local imports
import { HttpError } from "../helpers/index.js";
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
  console.log("avatarURL :", avatarURL);

  const hashedPassword = await bcrypt.hash(password, 10);

  const { subscription } = await User.create({
    ...req.body,
    avatarURL,
    password: hashedPassword,
  });

  res.status(201).json({ user: { email, subscription } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: userId, subscription } = user;

  const comparedPassword = await bcrypt.compare(password, user.password);
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

export default {
  registration: cntrllrWrapper(registration),
  login: cntrllrWrapper(login),
  logout: cntrllrWrapper(logout),
  current: cntrllrWrapper(current),
  updateSubscription: cntrllrWrapper(updateSubscription),
  updateAvatar: cntrllrWrapper(updateAvatar),
};
