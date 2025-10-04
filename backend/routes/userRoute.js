import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  adminRegister,
  userProfile,
  updateProfile,
  listUsers,
  updateUserStatus,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/adminregister", adminRegister);

// superadmin route kept for compatibility (calls adminLogin)
userRouter.post("/superadmin", (req, res) => {
  req.body.role = "superadmin";
  return adminLogin(req, res);
});

userRouter.get("/profile", authUser, userProfile);

// Update profile and password (protected)
userRouter.post("/profile/update", authUser, updateProfile);

// Admin-only routes: list users and update user status
userRouter.get("/list", adminAuth, listUsers);
userRouter.post("/:id/status", adminAuth, updateUserStatus);

export default userRouter;
