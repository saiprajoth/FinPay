"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z
    .object({
    firstname: zod_1.z.string().min(1).optional(),
    lastname: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(6).optional(),
})
    .refine((data) => data.firstname || data.lastname || data.password, {
    message: "At least one field must be provided",
});
