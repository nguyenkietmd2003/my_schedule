import {
  addFreeTimeService,
  deleteFreeTimeService,
  getFreeTimeByUserIDService,
  updateFreeTimeService,
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
export const updateFreeTime = async (req, res) => {
  const { id } = req.params;
  const { freeTimeId, start_time, end_time } = req.body;
  try {
    const result = await updateFreeTimeService(
      id,
      freeTimeId,
      start_time,
      end_time
    );
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFreeTime = async (req, res) => {
  const { freeTimeId } = req.params;

  try {
    const result = await deleteFreeTimeService(freeTimeId);

    if (result.ER === 1) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
