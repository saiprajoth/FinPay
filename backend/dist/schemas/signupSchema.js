"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.usernameSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.usernameSchema = zod_1.default.string().min(2, 'username should have atleast 2 characters').max(12, 'username should have atmost 12 characters');
exports.signUpSchema = zod_1.default.object({
    username: exports.usernameSchema,
    email: zod_1.default.email(),
    password: zod_1.default.string().min(2, 'password should have atleast 2 characters').max(12, 'password should have atmost 12 characters'),
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string().optional(),
});
