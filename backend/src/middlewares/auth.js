import jwt from "jsonwebtoken";
import { verifyToken } from "../config/jwt.js";

//
// const auth = (req, res, next) => {
//   const white_list = ["/", "/register", "/login"];

//   if (white_list.find((item) => "v1/api" + item === req.originalUrl)) {
//     next();
//   } else {
//     if (req?.headers?.authorization?.split(" ")?.[1]) {
//     }
//   }
// };

//
//
//
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    console.log(req.user, "req.user");

    //
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return res.status(401).json({ message: "Token expired" });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
