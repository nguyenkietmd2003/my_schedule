import { getScheduleShareLinkService } from "./../services/scheduleService.js";
import {
  createScheduleService,
  deleteScheduleService,
  getAllScheduleService,
  getScheduleByIDService,
  sharedScheduleService,
  updateScheduleService,
} from "../services/scheduleService.js";

export const getAllSchedule = async (req, res) => {
  try {
    const result = await getAllScheduleService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getScheduleByID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getScheduleByIDService(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  const {
    user_id,
    title,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  } = req.body;
  const data = {
    user_id,
    title,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  };
  try {
    const result = await createScheduleService(data);
    if (result.message === "Schedule conflicts with existing schedules") {
      return res.status(400).json({ status: 400, data: result });
    }
    return res.status(201).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateSchedule = async (req, res) => {
  const { idSchedule } = req.params;
  const { user_id, start_time, end_time, title, priority } = req.body;
  const data = { user_id, start_time, end_time, title, priority };
  try {
    const result = await updateScheduleService(idSchedule, data);
    if (result.message === "Schedule conflicts with existing schedules") {
      return res.status(400).json({ status: 400, data: result });
    }
    return res.status(201).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteScheduleService(id);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const sharedSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sharedScheduleService(id);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getInfoShareLink = async (req, res) => {
  const { randomString } = req.params;

  try {
    const data = await getScheduleShareLinkService(randomString);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
