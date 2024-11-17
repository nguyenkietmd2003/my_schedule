import {
  loginService,
  registerServicee,
  sendOtpService,
} from "../services/userService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

//---------------------------------------------------------------- ver 2

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await sendOtpService(email);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const register2 = async (req, res) => {
  const { email, otp, password, name } = req.body;
  try {
    const result = await registerServicee(email, otp, password, name);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
