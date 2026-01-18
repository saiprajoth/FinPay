"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = dbConnect;
const mongoose_1 = __importDefault(require("mongoose"));
async function dbConnect() {
    try {
        console.log(process.env.MONGOURL);
        const result = await mongoose_1.default.connect(process.env.MONGOURL || "");
        console.log("database connection successfull");
        return;
    }
    catch (error) {
        console.error("error occured while connecting to the database");
        process.exit(1);
    }
}
