import express from "express";
import { 
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserProfile,
    changeUserPassword,
} from "../controllers/UserController.js";
import { protect } from "../middlewares/Auth.js";

const router = express.Router();

// User Routes
router.post("/", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile); 
router.put("/password",protect,changeUserPassword);
export default router;
