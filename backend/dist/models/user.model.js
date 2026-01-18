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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "enter a valid email id",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [2, "password should of atleast 2 characters"],
    },
    firstname: {
        type: String,
        required: [true, "firstname is required"],
    },
    lastname: {
        type: String,
    },
});
const AccountSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'user id is required for accounts']
    },
    balance: {
        type: Number,
        required: [true, 'balance amount is required']
    }
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
exports.AccountModel = mongoose_1.default.model("Account", AccountSchema);
