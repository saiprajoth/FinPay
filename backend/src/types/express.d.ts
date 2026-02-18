import "express";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    identifier?: string;
    userID?:Types.ObjectId;
  }
}
