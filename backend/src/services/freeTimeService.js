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

export const updateFreeTimeService = async (req, res) => {
  try {
    const { id } = req.params;
    const { freeTimeStart, freeTimeEnd } = req.body;

    const startTime = new Date(freeTimeStart);
    const endTime = new Date(freeTimeEnd);

    if (startTime >= endTime) {
      return {
        message: "Thời gian bắt đầu phải trước thời gian kết thúc.",
        ER: 4,
      };
    }

    const freeTime = await FreeTimeConfiguration.findByPk(id);
    if (!freeTime) {
      return { message: "Không tìm thấy lịch rảnh cần sửa.", ER: 3 };
    }

    const overlappingSchedules = await WorkSchedule.findAll({
      where: {
        user_id: freeTime.user_id,
        [Op.or]: [
          {
            start_time: {
              [Op.lt]: endTime,
            },
            end_time: {
              [Op.gt]: startTime,
            },
          },
        ],
      },
    });

    if (overlappingSchedules.length > 0) {
      return {
        ER: 2,
        message:
          "Thời gian rảnh bị trùng với lịch làm việc. Vui lòng chọn thời gian khác.",
      };
    }

    freeTime.free_time_start = startTime;
    freeTime.free_time_end = endTime;
    await freeTime.save();

    return { ER: 0, message: freeTime };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
