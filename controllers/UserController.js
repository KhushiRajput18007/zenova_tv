import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/Auth.js"; // Ensure correct import

// @desc Register user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, image } = req.body;
    try {
        const userExists = await User.findOne({ email });

        // Check if user exists
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in DB
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            image,
        });

        // If user created successfully send user data and token to client
        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Login user
const loginUser = asyncHandler(async (req, res) => { 
    const { email, password } = req.body;

    try {
        // Find user in DB
        const user = await User.findOne({ email });

        // If user exists, compare password with hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Update user profile
// @route PUT /api/users/profile 
// @access Private 
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, image } = req.body;
    try {
        // Find user in DB 
        const user = await User.findById(req.user._id);

        // If user exists, update user data and save it in DB 
        if (user) { 
            user.fullName = fullName || user.fullName;
            user.email = email || user.email; 
            user.image = image || user.image; 

            const updatedUser = await user.save();

            // Send updated user data and token to client 
            res.json({
                _id: updatedUser._id, 
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                image: updatedUser.image, 
                isAdmin: updatedUser.isAdmin, 
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404); 
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// @desc Delete user profile 
// @route DELETE /api/users/profile
// @access Private 
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
      // Find user in DB 
      const user = await User.findById(req.user._id);

      // If user exists, delete user from DB
      if (user) {
          // If user is admin, prevent deletion
          if (user.isAdmin) {
              res.status(400);
              throw new Error("Can't delete admin user");
          }

          // Delete user
          await User.deleteOne({ _id: user._id });

          res.json({ message: "User deleted successfully" });
      } else {
          res.status(404);
          throw new Error("User not found");
      }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});
// @desc Change user password
// @route PUT /api/users/password
// @access Private
const changeUserPassword = asyncHandler(async (req, res, next) => {
    console.log("Request Body:", req.body); // ✅ Debugging: Check if request body is received
  
    const { oldPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid old password");
      }
  
      // Hash new password and update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      res.json({ message: "Password changed successfully!" });
    } catch (error) {
      next(error); // Pass error to error middleware
    }
  });
  
  

export {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
};



