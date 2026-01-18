"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const accountRouter = express_1.default.Router();
accountRouter.get('/balance', authMiddleware_1.authMiddleware, (req, res) => {
    try {
        const token = req.token;
    }
    catch (error) {
        console.error('error occured while fetching user balance : ', error);
        return res.status(500).json({
            success: false,
            message: 'error occured while fetching user balance'
        });
    }
});
