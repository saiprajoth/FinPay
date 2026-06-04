import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import type { Response, Request, NextFunction } from "express";
import { prisma } from "@repo/db/client";

type TokenPayload = JwtPayload & {
  userID: number | string;
};

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies ? req.cookies.token : null;

    console.log("this is the token : ",token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "",
    ) as TokenPayload;

    const id = Number(payload.userID);

    if (Number.isNaN(id)) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        Id: id,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue",
      });
    }

    console.log(`id from authMiddleware ${id}`);

    req.userID = id;

    next();
  } catch (error) {
    console.error("error occured while processing auth-middleware : ",error);
    return res.status(500).json({
      success: false,
      message: "error occured while processing auth-middleware",
    });
  }
}

export default authMiddleware;