import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";
let model = initModels(sequelize);

export const getDefaultScheduleService = async (userId) => {
  // const { userId } = req.params;

  try {
    const defaultSchedule = await model.DefaultScheduleConfiguration.findOne({
      where: { user_id: userId },
      include: [
        {
          model: model.DefaultScheduleTime,
          attributes: [
            "default_schedule_id",
            "day_of_week",
            "start_time",
            "end_time",
          ],
          as: "DefaultScheduleTimes",
        },
      ],
    });

    if (!defaultSchedule) {
      return { message: "Lịch default không tồn tại cho user này.", ER: 1 };
    }

    return {
      schedule: defaultSchedule.DefaultScheduleTimes,
      ER: 0,
    };
  } catch (error) {
    throw error;
  }
};

export const updateDefaultScheduleService = async (userId, scheduleData) => {
  /**
   * @param {number} userId - ID của user
   * @param {Array} scheduleData - Danh sách thời gian cần cập nhật (rỗng nếu không chọn gì)
   */
  console.log(scheduleData);
  try {
    // Tìm DefaultScheduleConfiguration theo userId
    const defaultSchedule = await model.DefaultScheduleConfiguration.findOne({
      where: { user_id: userId },
    });

    // Kiểm tra nếu không tồn tại
    if (!defaultSchedule) {
      return { message: "Lịch default không tồn tại cho user này.", ER: 2 };
    }

    // Xóa tất cả các thời gian cũ trong DefaultScheduleTime
    await model.DefaultScheduleTime.destroy({
      where: { default_schedule_id: defaultSchedule.id },
    });

    // Nếu scheduleData rỗng, chỉ cần thông báo đã xóa hết
    if (scheduleData.length === 0) {
      return {
        message: "Lịch default đã được xóa hoàn toàn.",
        ER: 1,
      };
    }

    // Tạo các thời gian mới từ scheduleData
    const newScheduleTimes = scheduleData.map((time) => ({
      default_schedule_id: defaultSchedule.id,
      day_of_week: time.day_of_week,
      start_time: time.start_time,
      end_time: time.end_time,
    }));

    await model.DefaultScheduleTime.bulkCreate(newScheduleTimes);

    return { message: "Cập nhật lịch default thành công.", ER: 0 };
  } catch (error) {
    console.error(error);
    throw new Error("Có lỗi xảy ra khi cập nhật lịch default.");
  }
};
export const getDefaultScheduleID = async (user_id) => {
  try {
    const getIDDefault = await model.DefaultScheduleConfiguration.findOne({
      where: { user_id: user_id },
    });
    return getIDDefault.id;
  } catch (error) {
    throw error;
  }
};
