import {
  addFreeTimeService,
  getFreeTimeByUserIDService,
} from "../services/freeTimeService.js";

export const addFreTime = async (req, res) => {
  const { userId, start_time, end_time } = req.body;
  try {
    const result = await addFreeTimeService(userId, start_time, end_time);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getFreeTimeByUserID = async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await getFreeTimeByUserIDService(user_id);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
