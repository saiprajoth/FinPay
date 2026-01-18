"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const signupSchema_1 = require("./signupSchema");
exports.signInSchema = zod_1.default.object({
    identifier: zod_1.default.union([signupSchema_1.usernameSchema, zod_1.default.email()]),
    password: zod_1.default.string().min(2, 'password should be atleast of 2 characters').max(12, 'password can be atmost of 12 characters')
});
