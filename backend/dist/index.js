"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const port = 3000;
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnect_1 = require("./helper/dbConnect");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, dbConnect_1.dbConnect)();
app.use((0, cors_1.default)());
app.use('/user', userRoutes_1.default);
app.listen(port, () => { console.log("listening at port : 3000"); });
