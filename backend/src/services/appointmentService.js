import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";
import { sendEmail } from "./sendEmailService.js";
let model = initModels(sequelize);

export const bookAppointmentService = async (data) => {
  const { user_id, start_time, end_time, guest_name, guest_email, content } =
    data;
  try {
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
      return {
        ER: 1,
        message: "Có xung đột với lịch hiện tại. Vui lòng chọn thời gian khác.",
      };
    }
    if (guest_name && guest_email) {
      const user = await model.User.findByPk(user_id);
      const newBooking = await model.Booking.create({
        user_id,
        end_time,
        start_time,
        guest_name,
        guest_email,
        content,
        status: "pending",
      });
      await sendEmail(
        user.email,
        "New Booking",
        `Please visit the calendar for details: ${content}`
      );
      return {
        message: newBooking,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const getBookingByUserIDService = async (user_id) => {
  try {
    const data = await model.Booking.findAll({
      where: { user_id },
    });
    if (!data) return { message: "No booking found" };
    return { message: data };
  } catch (error) {
    throw error;
  }
};

export const acceptBookingService = async (id) => {
  try {
    const booking = await model.Booking.findByPk(id);

    if (!booking) {
      return { message: "Booking không tồn tại" };
    }

    booking.status = "approved";
    await booking.save();
    const user = await model.User.findByPk(booking.user_id);
    await sendEmail(
      user.email,
      "Booking Approved",
      `Your booking has been approved. Details: ${booking.content}`
    );
    await sendEmail(
      booking.user_id,
      "Booking Approved",
      `Your booking with ${user.name} has been approved. Details: ${booking.content}`
    );
    return { message: "Booking đã được phê duyệt" };
  } catch (error) {
    throw error;
  }
};

export const rejectedBookingService = async (id) => {
  try {
    // Tìm booking theo id
    const booking = await model.Booking.findByPk(id);

    if (!booking) {
      return { message: "Booking không tồn tại" };
    }

    booking.status = "rejected";
    await booking.save();

    // Gửi email thông báo
    const user = await model.User.findByPk(booking.user_id);
    await sendEmail(
      user.email,
      "Booking Rejected",
      `Your booking has been rejected. Details: ${booking.content}`
    );
    await sendEmail(
      booking.guest_email,
      "Booking Rejected",
      `Your booking with ${user.name} has been rejected. Details: ${booking.content}`
    );

    await booking.destroy();

    return { message: "Booking đã được từ chối và xóa" };
  } catch (error) {
    throw error;
  }
};
