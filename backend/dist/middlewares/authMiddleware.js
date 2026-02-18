"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        // console.log("this is authHeader : ",authHeader)
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_JWT);
        const identifier = decoded.identifier;
        // console.log("this is the identifier : ",identifier);
        const UserFound = await user_model_1.UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });
        if (!UserFound) {
            // console.log("user not found at authmiddleware")
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        req.identifier = identifier;
        req.userID = UserFound._id;
        // console.log("jwt authentication done : authmiddleware")
        next();
    }
    catch (error) {
        console.log("error occured at authMiddleware : ", error);
        return res.status(500).json({
            success: false,
            message: "error occured at authMiddleware",
        });
    }
}
