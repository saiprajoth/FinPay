"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const signupSchema_1 = require("../schemas/signupSchema");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signInSchema_1 = require("../schemas/signInSchema");
const dotenv = __importStar(require("dotenv"));
const updateUserSchema_1 = require("../schemas/updateUserSchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const user_model_2 = require("../models/user.model");
dotenv.config();
const userRouter = express_1.default.Router();
userRouter.use(body_parser_1.default.json());
userRouter.post("/sign-up", async (req, res) => {
    try {
        const body = req.body;
        const validation = signupSchema_1.signUpSchema.safeParse(body);
        if (!validation.success || !validation.data) {
            return res.status(400).json({
                success: false,
                message: "kindly enter the required fields for the sign up process",
                error: validation.error,
            });
        }
        const { username } = validation.data;
        const findUserByUsername = await user_model_1.UserModel.findOne({ username: username });
        if (findUserByUsername) {
            return res.status(409).json({
                success: false,
                message: `${username} already taken, kindly user another one`,
            });
        }
        const { email } = validation.data;
        const findUserByEmail = await user_model_1.UserModel.findOne({ email: email });
        const { firstname, lastname, password } = validation.data;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        if (findUserByEmail) {
            findUserByEmail.username = username;
            findUserByEmail.firstname = firstname;
            if (lastname) {
                findUserByEmail.lastname = lastname;
            }
            findUserByEmail.password = hashedPassword;
            await findUserByEmail.save();
        }
        else {
            const userRegistered = await user_model_1.UserModel.create({
                username,
                password: hashedPassword,
                email,
                firstname,
                ...(lastname && { lastname }),
            });
            await user_model_2.AccountModel.create({
                userID: userRegistered._id,
                balance: 1 + Math.random() * 10000,
            });
        }
        console.log(process.env.SECRET_KEY_JWT);
        const token = jsonwebtoken_1.default.sign({ identifier: username }, process.env.SECRET_KEY_JWT || "");
        return res.status(200).json({
            success: true,
            message: "user registration successfull",
            token: token,
        });
    }
    catch (error) {
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
        const validation = signInSchema_1.signInSchema.safeParse(body);
        if (!validation.success || !validation.data) {
            return res.status(400).json({
                success: false,
                message: "kindly enter the required fields for the sign up process",
            });
        }
        const { identifier } = validation.data;
        const findUser = await user_model_1.UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: `user doesn't exists, please sign up`,
            });
        }
        console.log(process.env.SECRET_KEY_JWT);
        const token = jsonwebtoken_1.default.sign({ identifier: identifier }, process.env.SECRET_KEY_JWT || "");
        return res.status(200).json({
            success: true,
            message: "user sign-in successfull",
            token: token,
        });
    }
    catch (error) {
        console.error("error occured while sign up process : ", error);
        res.status(500).json({
            success: false,
            message: "error occured while sign up process",
        });
    }
});
userRouter.put("/update", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const token = req.token;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_JWT);
        const body = req.body;
        const validation = updateUserSchema_1.updateUserSchema.safeParse(body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "please enter the correct fields for the user updations",
            });
        }
        const { firstname, lastname, password } = validation.data;
        const identifier = decoded.identifier;
        const findUser = await user_model_1.UserModel.findOne({
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
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            findUser.password = hashedPassword;
        }
        await findUser.save();
        return res.status(200).json({
            success: true,
            message: "user updations successfull",
        });
    }
    catch (error) {
        console.error("error occured while updating the user information : ", error);
        return res.status(500).json({
            success: false,
            message: "error occured while updating the user information ",
        });
    }
});
exports.default = userRouter;
