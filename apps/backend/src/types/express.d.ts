


import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userID?: number;
    }
  }
}

export {};