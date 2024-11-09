import { sequelize } from "../config/database.js";
import initModels from "./../models/init-models.js";
import { createToken } from "./../config/jwt.js";

let model = initModels(sequelize);
export const loginService = async (email, password) => {
  try {
    const checkEmail = await model.User.findOne({
      where: { email },
    });
    if (checkEmail) {
      if (checkEmail.password === password) {
        const user = {
          id: checkEmail.id,
          name: checkEmail.name,
          email: checkEmail.email,
        };
        const token = createToken(user);
        return { token: token, user: user };
      }
    }
    throw new Error("Couldn't find user");
  } catch (error) {
    throw error;
  }
};

export const registerService = async (name, password, email) => {
  try {
    const checkEmailExist = await model.User.findOne({
      where: { email },
    });
    if (!checkEmailExist) {
      const newUser = await model.User.create({
        name,
        password,
        email,
      });
      return { message: "Register successfully", data: newUser };
    }
    return { message: "email already registered" };
  } catch (error) {
    throw error;
  }
};
export const getUserInfoService = async (user_id) => {
  try {
    const user = await model.User.findByPk(user_id);
    if (!user) throw new Error("User not found");
    return { data: user };
  } catch (error) {
    throw error;
  }
};
