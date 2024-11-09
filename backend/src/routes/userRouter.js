import express from "express";
import { getInfoUser, login, register } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.post("/get-info/:user_id", getInfoUser);
export default userRouter;
