"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token" });
        }
        const token = authHeader.split(" ")[1];
        req.token = token;
        next();
    }
    catch (error) {
        console.error("error occured at authMiddleware : ", error);
        return res.status(500).json({
            success: false,
            message: "error occured at authMiddleware",
        });
    }
}
