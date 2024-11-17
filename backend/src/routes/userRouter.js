import express from "express";
import {
  getInfoUser,
  login,
  register2,
  sendOtp,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/login", login);
userRouter.post("/get-info/:user_id", getInfoUser);
//------------------------------ver 2
userRouter.post("/send-otp", sendOtp);
userRouter.post("/register2", register2);

export default userRouter;
