import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { AccountModel } from "../models/user.model";
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    // console.log("this is authHeader : ",authHeader)
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY_JWT!,
    ) as JwtPayload;

    const identifier=decoded.identifier;

    // console.log("this is the identifier : ",identifier);

    const UserFound = await UserModel.findOne({$or:[{username:identifier},{email:identifier}]});

    if(!UserFound){
    // console.log("user not found at authmiddleware")
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
    }

    req.identifier=identifier;
    req.userID=UserFound._id;

    // console.log("jwt authentication done : authmiddleware")
    

    next();
  } catch (error) {
    console.log("error occured at authMiddleware : ", error);
    return res.status(500).json({
      success: false,
      message: "error occured at authMiddleware",
    });
  }
}
