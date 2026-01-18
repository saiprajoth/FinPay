import express from "express";
import bodyParser from "body-parser";
import { signUpSchema } from "../schemas/signupSchema";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { signInSchema } from "../schemas/signInSchema";
import * as dotenv from "dotenv";
import { updateUserSchema } from "../schemas/updateUserSchema";
import { success } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AccountModel } from "../models/user.model";
dotenv.config();
const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.post("/sign-up", async (req, res) => {
  try {
    const body = req.body;
    const validation = signUpSchema.safeParse(body);
    if (!validation.success || !validation.data) {
      return res.status(400).json({
        success: false,
        message: "kindly enter the required fields for the sign up process",
        error: validation.error,
      });
    }

    const { username } = validation.data;

    const findUserByUsername = await UserModel.findOne({ username: username });

    if (findUserByUsername) {
      return res.status(409).json({
        success: false,
        message: `${username} already taken, kindly user another one`,
      });
    }

    const { email } = validation.data;

    const findUserByEmail = await UserModel.findOne({ email: email });

    const { firstname, lastname, password } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (findUserByEmail) {
      findUserByEmail.username = username;
      findUserByEmail.firstname = firstname;
      if (lastname) {
        findUserByEmail.lastname = lastname;
      }
      findUserByEmail.password = hashedPassword;

      await findUserByEmail.save();
    } else {
      const userRegistered = await UserModel.create({
        username,
        password: hashedPassword,
        email,
        firstname,
        ...(lastname && { lastname }),
      });

      await AccountModel.create({
        userID: userRegistered._id,
        balance: 1 + Math.random() * 10000,
      });
    }

    console.log(process.env.SECRET_KEY_JWT);
    const token = jwt.sign(
      { identifier: username },
      process.env.SECRET_KEY_JWT || "",
    );
    return res.status(200).json({
      success: true,
      message: "user registration successfull",
      token: token,
    });
  } catch (error) {
    console.error("error occured while sign up process : ", error);
    res.status(500).json({
      success: false,
      message: "error occured while sign up process",
    });
  }
});

userRouter.post("/sign-in", async (req, res) => {
  try {
    const body = req.body;
    const validation = signInSchema.safeParse(body);
    if (!validation.success || !validation.data) {
      return res.status(400).json({
        success: false,
        message: "kindly enter the required fields for the sign up process",
      });
    }

    const { identifier } = validation.data;

    const findUser = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: `user doesn't exists, please sign up`,
      });
    }

    console.log(process.env.SECRET_KEY_JWT);
    const token = jwt.sign(
      { identifier: identifier },
      process.env.SECRET_KEY_JWT || "",
    );
    return res.status(200).json({
      success: true,
      message: "user sign-in successfull",
      token: token,
    });
  } catch (error) {
    console.error("error occured while sign up process : ", error);
    res.status(500).json({
      success: false,
      message: "error occured while sign up process",
    });
  }
});

userRouter.put("/update", authMiddleware, async (req, res) => {
  try {
    const token = req.token!;
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY_JWT!,
    ) as JwtPayload;
    const body = req.body;
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "please enter the correct fields for the user updations",
      });
    }

    const { firstname, lastname, password } = validation.data;
    const identifier = decoded.identifier;

    const findUser = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (firstname) {
      findUser.firstname = firstname;
    }
    if (lastname) {
      findUser.lastname = lastname;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      findUser.password = hashedPassword;
    }

    await findUser.save();

    return res.status(200).json({
      success: true,
      message: "user updations successfull",
    });
  } catch (error) {
    console.error(
      "error occured while updating the user information : ",
      error,
    );
    return res.status(500).json({
      success: false,
      message: "error occured while updating the user information ",
    });
  }
});

export default userRouter;
