import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import bodyParser from "body-parser";
import { AccountModel, UserModel } from "../models/user.model";
import mongoose from "mongoose";
import { transferAmountSchema } from "../schemas/transferAmountSchema";
const accountRouter = express.Router();
accountRouter.use(bodyParser.json());

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const identifier = req.userID;

    const AccountFound = await AccountModel.findOne({ userID: identifier });

    if (!AccountFound) {
      return res.status(404).json({
        success: false,
        message: "account not found for the user",
      });
    }

    const balance = AccountFound.balance;

    return res.status(200).json({
      success: true,
      message: "user balance fetch successfull",
      balance: balance / 100,
      userID: AccountFound.userID,
    });
  } catch (error) {
    console.log("error occured while fetching user balance : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured while fetching user balance",
    });
  }
});

accountRouter.put("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const body = req.body;
    const senderID = req.userID?.toString();

    const validation = transferAmountSchema.safeParse(body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "please enter the correct fields for the transaction",
      });
    }

    const { amount, recipientID } = validation.data;

    console.log("senderID and recipientID : ",senderID," ",recipientID);

    if (senderID == recipientID) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "cannot transfer to self" });
    }

    if (amount <= 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "amount must be greater than zero",
      });
    }

    const FindRecipient = await AccountModel.findOne({
      userID: recipientID,
    }).session(session);

    if (!FindRecipient) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "recipient not found",
      });
    }

    console.log("this si the recipient : ",FindRecipient);

    const FindSender = await AccountModel.findOne({ userID: senderID }).session(
      session,
    );

    if (!FindSender) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "sender not found",
      });
    }

    if (FindSender.balance < amount * 100) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message:
          "insufficient balance, please try again with the required amount",
      });
    }

    console.log("this is the sender : ",FindSender);

    await AccountModel.updateOne(
      { userID: senderID },
      { $inc: { balance: -amount * 100 } },
      {session}
    ).session(session);
    await AccountModel.updateOne(
      { userID: recipientID },
      { $inc: { balance: +amount * 100 } },
      {session}
    ).session(session);

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "transaction successfull",
    });
  } catch (error) {
    console.log("error occured while processing the transaction : ", error);
    await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: "error occured while processing the transaction",
    });
  } finally {
    session.endSession();
  }
});

export default accountRouter;
