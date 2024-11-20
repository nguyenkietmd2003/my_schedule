import { sequelize } from "../config/database.js";
import { Op } from "sequelize";
import initModels from "../models/init-models.js";

let model = initModels(sequelize);

//
export const getScheduleByIDService = async (id) => {
  try {
    const checkUser = await model.User.findOne({
      where: { id },
    });
    if (!checkUser) return { message: "User not found" };
    const schedule = await model.WorkSchedule.findAll({
      where: { user_id: id },
    });
    if (schedule && schedule.length > 0) {
      return { message: schedule };
    }
  } catch (error) {
    throw error;
  }
};

//
export const getAllScheduleService = async () => {
  try {
    const data = await model.WorkSchedule.findAll();
    if (!data) return { message: "No work schedule " };
    return { message: data };
  } catch (error) {
    throw error;
  }
};
export const createScheduleService = async (data) => {
  const {
    user_id,
    title,
    start_time,
    end_time,
    priority,
    notification_time,
    is_canceled,
  } = data;

  // Kiểm tra thời gian bắt đầu và kết thúc
  if (new Date(start_time) >= new Date(end_time)) {
    return { message: "Start time must be before end time" };
  }

  try {
    // 1. Kiểm tra lịch đã tồn tại có trùng thời gian không
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: user_id,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            end_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: start_time } },
              { end_time: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });

    if (conflictingSchedules.length > 0) {
      return { message: "Schedule conflicts with existing schedules" };
    }

    const newSchedule = await model.WorkSchedule.create({
      user_id,
      title,
      description: "",
      start_time,
      end_time,
      priority,
      notification_time,
      is_canceled,
    });

    if (!newSchedule) return { message: "Cannot create new schedule" };

    //  Thêm vào bảng Notification nếu notification_time = true
    if (notification_time) {
      const notificationTime = new Date(start_time);
      notificationTime.setMinutes(notificationTime.getMinutes() - 5); // Trừ 5 phút từ start_time

      await model.Notification.create({
        work_schedule_id: newSchedule.id,
        user_id,
        notification_time: notificationTime,
        message: `Reminder for your schedule: ${title}`,
      });
    }

    return { message: "New schedule created successfully", data: newSchedule };
  } catch (error) {
    throw error;
  }
};

export const updateScheduleService = async (idSchedule, data) => {
  const { user_id, start_time, end_time, title, priority } = data;
  console.log(idSchedule);

  // Kiểm tra thời gian bắt đầu và kết thúc
  if (new Date(start_time) >= new Date(end_time)) {
    return { message: "Start time must be before end time" };
  }

  try {
    // 1. Tìm lịch cần cập nhật
    const checkSchedule = await model.WorkSchedule.findOne({
      where: { id: idSchedule },
    });

    if (!checkSchedule) {
      return { message: "Schedule not found" };
    }

    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: user_id,
        id: { [Op.ne]: idSchedule },
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            end_time: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: start_time } },
              { end_time: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });

    if (conflictingSchedules.length > 0) {
      return { message: "Schedule conflicts with existing schedules" };
    }

    const updateSchedule = await checkSchedule.update(data);
    return { message: "Schedule updated successfully", data: updateSchedule };
  } catch (error) {
    throw error;
  }
};

export const deleteScheduleService = async (id) => {
  try {
    console.log(id);
    const checkSchedule = await model.WorkSchedule.findOne({
      where: { id: id },
    });

    if (!checkSchedule) {
      return { message: "Schedule not found" };
    } else {
      console.log(checkSchedule.dataValues);
    }

    const notification = await model.Notification.findOne({
      where: {
        work_schedule_id: id,
      },
    });

    if (!notification) {
      const deleteSchedule = await checkSchedule.destroy();
      return { message: "Schedule deleted successfully", data: deleteSchedule };
    }
    if (notification) {
      await notification.destroy();
    }

    const deleteSchedule = await checkSchedule.destroy();
    return { message: "Schedule deleted successfully", data: deleteSchedule };
  } catch (error) {
    throw error;
  }
};

import crypto from "crypto";

export const sharedScheduleService = async (id) => {
  try {
    const existingLink = await model.PublicLink.findOne({
      where: { user_id: id },
    });
    if (existingLink) {
      return { message: existingLink.link, data: { link: existingLink.link } };
    }
    const domain = process.env.APP_DOMAIN || "http://localhost:5173";
    const path = "link-schedule";
    const randomString = crypto.randomBytes(5).toString("hex");
    const generateLink = `${domain}/${path}/${randomString}`;
    console.log(generateLink);
    const newLink = await model.PublicLink.create({
      user_id: id,
      link: generateLink,
    });
    return { message: "Schedule shared successfully", data: newLink };
  } catch (error) {
    throw error;
  }
};
export const getScheduleShareLinkService = async (randomString) => {
  try {
    // Tạo URL từ `randomString` và tìm trong bảng `PublicLink`
    const publicLink = await model.PublicLink.findOne({
      where: {
        link: `${
          process.env.APP_DOMAIN || "http://localhost:5173"
        }/link-schedule/${randomString}`,
      },
    });

    if (!publicLink) {
      return { message: "Liên kết không hợp lệ hoặc đã hết hạn." };
    }

    const schedule = await model.FreeTimeConfiguration.findAll({
      where: { user_id: publicLink.user_id },
    });

    if (!schedule) {
      return { message: "Không tìm thấy lịch." };
    }

    return { schedule };
  } catch (error) {
    throw error;
  }
};
