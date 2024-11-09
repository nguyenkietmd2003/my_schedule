import jwt from "jsonwebtoken";

export const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      throw error;
    }
    return decoded;
  });
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
