import { Op } from "sequelize";
import { sequelize } from "./../config/database.js";
import initModels from "./../models/init-models.js";
let model = initModels(sequelize);

//

export const getFreeTimeByUserIDService = async (user_id) => {
  try {
    const data = await model.FreeTimeConfiguration.findAll({
      where: { user_id: user_id },
    });
    return { message: data, ER: 0 };
  } catch (error) {
    throw error;
  }
};
export const addFreeTimeService = async (userId, start_time, end_time) => {
  console.log(userId, start_time, end_time);

  try {
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: userId,
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
      return { message: "Schedule conflicts with existing schedules", ER: 2 };
    }
    const conflictingFreeTime = await model.FreeTimeConfiguration.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          {
            free_time_start: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            free_time_end: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            [Op.and]: [
              { free_time_start: { [Op.lte]: start_time } },
              { free_time_end: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });
    if (conflictingFreeTime.length > 0) {
      return {
        message: "Free Time conflicts with existing free time configurations",
        ER: 1,
      };
    }
    const newFreeTime = await model.FreeTimeConfiguration.create({
      user_id: userId,
      free_time_start: start_time,
      free_time_end: end_time,
    });
    if (!newFreeTime) {
      return { message: "cannot create new FreeTime configuration" };
    }
    return { message: "Thêm lịch rảnh thành công", data: newFreeTime, ER: 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateFreeTimeService = async (
  id,
  freeTimeId,
  start_time,
  end_time
) => {
  console.log(id, freeTimeId, start_time, end_time);
  try {
    // Kiểm tra xem freeTimeId có tồn tại không
    const freeTime = await model.FreeTimeConfiguration.findOne({
      where: {
        id: freeTimeId,
      },
    });
    if (!freeTime) {
      return { message: "Không tìm thấy lịch rảnh", ER: 3 };
    }

    // Kiểm tra xung đột với lịch làm việc
    const conflictingSchedules = await model.WorkSchedule.findAll({
      where: {
        user_id: id,
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
      return { message: "Lịch rảnh bị xung đột với lịch làm việc", ER: 2 };
    }

    // Kiểm tra xung đột với các lịch rảnh khác (trừ lịch rảnh đang được cập nhật)
    const conflictingFreeTime = await model.FreeTimeConfiguration.findAll({
      where: {
        user_id: id,
        id: { [Op.ne]: freeTimeId }, // Loại trừ lịch rảnh đang được cập nhật
        [Op.or]: [
          {
            free_time_start: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            free_time_end: {
              [Op.between]: [start_time, end_time],
            },
          },
          {
            [Op.and]: [
              { free_time_start: { [Op.lte]: start_time } },
              { free_time_end: { [Op.gte]: end_time } },
            ],
          },
        ],
      },
    });
    if (conflictingFreeTime.length > 0) {
      return {
        message: "Lịch rảnh bị xung đột với các lịch rảnh khác",
        ER: 1,
      };
    }

    // Cập nhật lịch rảnh
    const updatedFreeTime = await model.FreeTimeConfiguration.update(
      {
        free_time_start: start_time,
        free_time_end: end_time,
      },
      {
        where: {
          id: freeTimeId,
        },
      }
    );
    console.log(updatedFreeTime);
    if (!updatedFreeTime) {
      return { message: "Không thể cập nhật lịch rảnh" };
    }
    return { message: "Cập nhật lịch rảnh thành công", ER: 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteFreeTimeService = async (freeTimeId) => {
  try {
    const relatedBookings = await model.Booking.findAll({
      where: { free_time_config_id: freeTimeId },
    });

    if (relatedBookings.length > 0) {
      return {
        message: "Không thể xóa lịch rảnh vì đang được sử dụng trong booking",
        ER: 1,
      };
    }

    await model.FreeTimeConfiguration.destroy({
      where: { id: freeTimeId },
    });

    return { message: "Xóa lịch rảnh thành công", ER: 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
