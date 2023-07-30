import { HttpError } from "../helpers/index.js";
import { cntrllrWrapper } from "../decorators/index.js";
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { token } from "morgan";
dotenv.config();

const { JWT_PHRASE } = process.env;

const registration = async (req, res) => {
  const { email, password } = req.body;

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });

  res.status(200).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

  console.log(user.token === token);

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

export default {
  registration: cntrllrWrapper(registration),
  login: cntrllrWrapper(login),
  logout: cntrllrWrapper(logout),
  current: cntrllrWrapper(current),
};
