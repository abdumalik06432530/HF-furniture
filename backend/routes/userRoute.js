import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  adminRegister,
  userProfile,
  updateProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/superadmin", (req, res) => {
  // reuse adminLogin handler but force role to superadmin
  req.body.role = "superadmin";
  return adminLogin(req, res);
});

userRouter.get("/profile", authUser, userProfile);

// Update profile and password (protected)
userRouter.post("/profile/update", authUser, updateProfile);

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/adminregister", adminRegister);

export default userRouter;
