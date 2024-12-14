import {
  getDefaultScheduleID,
  getDefaultScheduleService,
  updateDefaultScheduleService,
} from "../services/defaultSchedule.js";

export const getDefaultSchedule = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await getDefaultScheduleService(userId);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateDefaultSchedule = async (req, res) => {
  const { userId } = req.params;
  const { scheduleData } = req.body;
  console.log(scheduleData);
  try {
    const result = await updateDefaultScheduleService(userId, scheduleData);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getIDDefaultSchedule = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await getDefaultScheduleID(userId);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
