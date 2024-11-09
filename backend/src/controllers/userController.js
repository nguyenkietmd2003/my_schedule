import { loginService, registerService } from "../services/userService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const result = await registerService(name, password, email);
    return res.status(201).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getInfoUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await getUserInfoService(user_id);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
