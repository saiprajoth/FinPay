import { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { prisma } from "@repo/db/client";
import { transactionSchema } from "../schemas/transactionSchema.js";

const transactionRoutes = Router();

transactionRoutes.get(
  "/get-transactions",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userID = req.userID;

      if (!userID) {
        return res.status(401).json({
          success: false,
          message: "Please sign in to continue",
        });
      }

      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [{ senderId: userID }, { recipientId: userID }],
        },
        select: {
          Id: true,
          amount: true,
          createdAt: true,
          senderId: true,
          recipientId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const userIds = [
        ...new Set(transactions.flatMap((txn) => [txn.senderId, txn.recipientId])),
      ];

      const users = await prisma.user.findMany({
        where: {
          Id: { in: userIds },
        },
        select: {
          Id: true,
          name: true,
        },
      });

      const nameById = new Map(users.map((user) => [user.Id, user.name]));

      const formattedTransactions = transactions.map((txn) => ({
        ...txn,
        senderName: nameById.get(txn.senderId) || "Unknown user",
        recipientName: nameById.get(txn.recipientId) || "Unknown user",
        type: txn.senderId === userID ? "sent" : "received",
      }));

      return res.status(200).json({
        success: true,
        message: "transactions fetched successfully",
        transactions: formattedTransactions,
      });
    } catch (error) {
      console.error(
        "error occured while fetching the transactions for the user : ",
        error,
      );
      return res.status(500).json({
        success: false,
        message: "error occured while fetching the transactions for the user",
      });
    }
  },
);

transactionRoutes.post(
  "/create-transaction",
  authMiddleware,
  async (req, res) => {
    try {
      const validation = transactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid amount and receiver before sending money",
        });
      }

      const userID = req.userID;

      if (!userID) {
        return res.status(401).json({
          success: false,
          message: "Please sign in to continue",
        });
      }

      const { amount, recipientId } = validation.data;

      if (userID === recipientId) {
        return res.status(400).json({
          success: false,
          message: "You cannot send money to yourself",
        });
      }

      const recipient = await prisma.user.findFirst({
        where: {
          Id: recipientId,
          isAcceptingPayments: true,
          isVerified: true,
        },
      });

      if (!recipient) {
        return res.status(404).json({
          success: false,
          message:
            "Receiver is not verified or is not accepting payments right now",
        });
      }

      const sender = await prisma.user.findUnique({
        where: {
          Id: userID,
        },
      });

      if (!sender) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      if (!sender.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your account before sending money",
        });
      }

      if (sender.balance < amount) {
        return res.status(400).json({
          success: false,
          message: "insufficient balance",
        });
      }

      await prisma.$transaction(async (tx) => {
        const senderUpdate = await tx.user.updateMany({
          where: {
            Id: userID,
            balance: {
              gte: amount,
            },
          },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        if (senderUpdate.count === 0) {
          throw new Error("insufficient balance");
        }

        await tx.user.update({
          where: {
            Id: recipientId,
          },
          data: {
            balance: {
              increment: amount,
            },
          },
        });

        await tx.transaction.create({
          data: {
            amount,
            createdAt: new Date(),
            senderId: userID,
            recipientId,
          },
        });
      });

      return res.status(200).json({
        success: true,
        message: "transaction successfull",
      });
    } catch (error) {
      console.error("error occured while processing the transaction", error);
      return res.status(500).json({
        success: false,
        message: "error occured while processing the transaction",
      });
    }
  },
);

export default transactionRoutes;