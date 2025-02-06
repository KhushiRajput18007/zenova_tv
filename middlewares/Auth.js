import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Middleware to Protect Routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

export { generateToken, protect };
