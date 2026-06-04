import { Router } from "express";
import userSchema from "../schemas/userSchema.js";
const userRoutes = Router();
import { signInSchema } from "../schemas/signInSchema.js";
import { prisma } from "@repo/db/client";
import bcrypt from "bcryptjs";
import sendVerificationCode from "../helpers/sendVerificationCode.js";
import jwt from "jsonwebtoken";
import verifySchema from "../schemas/verifySchema.js";
import authMiddleware from "../middlewares/authMiddleware.js";

userRoutes.get("/", (req, res) => {
  res.status(200).json({
    message: "healthy api check",
  });
});

userRoutes.post("/sign-up", async (req, res) => {
  try {
    const body = req.body;

    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      console.log(
        "inputs didnt match the required input fields, signup failed",
      );
      return res.status(400).json({
        success: false,
        message: "inputs didnt match the required input fields, signup failed",
      });
    }

    const { name, email, password } = validation.data;

    const findUserByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);

    if (findUserByEmail) {
      if (findUserByEmail.isVerified) {
        return res.status(409).json({
          success: false,
          message: "user already registered",
        });
      } else {
        await prisma.user.update({
          where: {
            Id: findUserByEmail.Id,
          },
          data: {
            name: name,
            password: hashedPassword,
            verifyCode: verifyCode,
            verifyCodeExpiry: verifyCodeExpiry,
            isAcceptingPayments: true,
          },
        });

        console.log(
          "details updated, but user is not verified, kindly verify the user, redirecting you to verificaton page...",
        );
      }
    } else {
      await prisma.user.create({
        data: {
          name: name,
          password: hashedPassword,
          balance: 500,
          email: email,
          isVerified: false,
          verifyCode: verifyCode,
          verifyCodeExpiry: verifyCodeExpiry,
          isAcceptingPayments: true,
        },
      });
    }

    const result = await sendVerificationCode(email, verifyCode, name);

    const message = result.success
      ? "user registratioin successfull"
      : "user registration failed";

    return res
      .status(result.success ? 200 : 500)
      .json({ success: result.success, message: message });
  } catch (error) {
    console.error("error occured while registering the user");
    return res.status(500).json({
      success: false,
      message: "error occured while registering the user",
    });
  }
});

userRoutes.post("/sign-in", async (req, res) => {
  try {
    const body = req.body;
    const validation = signInSchema.safeParse(body);

    if (!validation.success) {
      console.log(
        "inputs didnt match the required input fields, signup failed",
      );
      return res.status(400).json({
        success: false,
        message: "inputs didnt match the required input fields, signup failed",
      });
    }

    const { email, password } = validation.data;

    const findUserByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUserByEmail) {
      return res.status(404).json({
        success: false,
        message: "user not found, sign-in failed",
      });
    } else {
      if (!findUserByEmail.isVerified) {
        return res.status(403).json({
          success: false,
          message: "user not verified, kindly verify the user : sign-in failed",
        });
      }
    }

    const passwordCheck = await bcrypt.compare(
      password,
      findUserByEmail.password,
    );

    if (!passwordCheck) {
      return res.status(401).json({
        success: passwordCheck,
        message: "incorrect password",
      });
    }

    const token = jwt.sign(
      { userID: findUserByEmail.Id },
      process.env.JWT_SECRET || "",
      { expiresIn: "30m" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      message: "sign-in successfull",
    });
  } catch (error) {
    console.error("error occured while signing in");
    return res.status(500).json({
      success: false,
      message: "error occured while signing in",
    });
  }
});

userRoutes.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

userRoutes.post("/verify", async (req, res) => {
  try {
    const body = req.body;
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      console.log(
        "inputs didnt match the required input fields, verification failed",
      );
      return res.status(400).json({
        success: false,
        message:
          "inputs didnt match the required input fields, verification failed",
      });
    }

    const { email, otp } = validation.data;

    const findUserByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUserByEmail) {
      return res.status(404).json({
        success: false,
        message: "user not found : verification aborted",
      });
    }

    const now = new Date(Date.now());

    if (findUserByEmail.verifyCode != otp) {
      return res.status(400).json({
        success: false,
        message: "invalid verification code : verification aborted",
      });
    }

    if (findUserByEmail.verifyCodeExpiry < now) {
      return res.status(400).json({
        success: false,
        message: "verification code expired : verification aborted",
      });
    }

    await prisma.user.update({
      where: {
        Id: findUserByEmail.Id,
      },
      data: {
        isVerified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "user verification successfull",
    });
  } catch (error) {
    console.error("error occured while verifying the user : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured while verifying the user",
    });
  }
});

userRoutes.get("/me", authMiddleware, async (req, res) => {
  try {
    const userID = req.userID;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        Id: userID,
      },
      select: {
        Id: true,
        name: true,
        email: true,
        balance: true,
        isVerified: true,
        isAcceptingPayments: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userID }, { recipientId: userID }],
      },
      select: {
        amount: true,
        senderId: true,
        recipientId: true,
      },
    });

    const totalSent = transactions
      .filter((transaction) => transaction.senderId === userID)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalReceived = transactions
      .filter((transaction) => transaction.recipientId === userID)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return res.status(200).json({
      success: true,
      message: "user details fetched successfully",
      user: {
        ...user,
        transactionCount: transactions.length,
        sentCount: transactions.filter(
          (transaction) => transaction.senderId === userID,
        ).length,
        receivedCount: transactions.filter(
          (transaction) => transaction.recipientId === userID,
        ).length,
        totalSent,
        totalReceived,
      },
    });
  } catch (error) {
    console.error("error occured while fetching current user : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured while fetching current user",
    });
  }
});

userRoutes.patch("/payment-settings", authMiddleware, async (req, res) => {
  try {
    const userID = req.userID;
    const { isAcceptingPayments } = req.body;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue",
      });
    }

    if (typeof isAcceptingPayments !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAcceptingPayments must be true or false",
      });
    }

    const user = await prisma.user.update({
      where: {
        Id: userID,
      },
      data: {
        isAcceptingPayments,
      },
      select: {
        Id: true,
        name: true,
        isAcceptingPayments: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "payment settings updated successfully",
      user,
    });
  } catch (error) {
    console.error("error occured while updating payment settings : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured while updating payment settings",
    });
  }
});

userRoutes.get("/get-user-list", authMiddleware, async (req, res) => {
  try {
    const value = String(req.query.value ?? "");
    const userID = req.userID;

    const result = await prisma.user.findMany({
      where: {
        Id: { not: userID },
        isVerified: true,
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
      select: {
        Id: true,
        name: true,
        isAcceptingPayments: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "users fetched successfully",
      users: result,
    });
  } catch (error) {
    console.error("error occured while fetching the users : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured while fetching the users",
    });
  }
});

export default userRoutes;