import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import initModels from "../models/init-models.js";
let model = initModels(sequelize);
import { sendEmail } from "./sendEmailService.js";
//

export const createBookingService = async (
  user_id,
  start_time,
  end_time,
  guest_name,
  guest_email,
  content,
  name_company,
  verificationCode
) => {
  try {
    const verificationRecord = await model.EmailVerification.findOne({
      where: { email: guest_email },
    });
    console.log("check code", verificationCode);

    if (!verificationRecord || verificationRecord.code !== verificationCode) {
      return { message: "Mã xác thực không hợp lệ", ER: 1 };
    }

    const newBooking = await model.Booking.create({
      user_id,
      start_time,
      end_time,
      guest_name,
      guest_email,
      content,
      name_company,
      status: "pending",
    });
    await model.FreeTimeConfiguration.destroy({
      where: {
        user_id,
        free_time_start: start_time,
        free_time_end: end_time,
      },
    });

    return {
      message: "Booking created successfully",
      ER: 0,
      data: newBooking,
    };
  } catch (error) {
    throw error;
  }
};

//
export const requestEmailVerificationService = async (guest_email) => {
  try {
    const verificationCode = generateVerificationCode();

    await model.EmailVerification.upsert({
      email: guest_email,
      code: verificationCode,
      expiresAt: new Date(new Date().getTime() + 15 * 60000),
    });

    await sendEmail(
      guest_email,
      `Email Verification Code : ${verificationCode}`,
      `This code is valid for 15 minutes. If you did not request this verification, please ignore this email.`
    );

    return {
      message: "Mã xác thực đã được gửi qua email",
      ER: 0,
      data: verificationCode,
    };
  } catch (error) {
    throw error;
  }
};
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//
export const bookingService = async (
  free_time_config_id,
  guest_name,
  guest_email,
  content,
  name_company
) => {
  try {
    const newBooking = await model.Booking.create({
      free_time_config_id,
      guest_name,
      guest_email,
      content,
      name_company,
      status: "pending",
    });
    return { message: "Booking created successfully", ER: 0, data: newBooking };
  } catch (error) {
    throw error;
  }
};

export const rejectBookingServicee = async (id) => {
  try {
    const booking = await model.Booking.findByPk(id);

    if (!booking) {
      return { message: "Booking không tồn tại", ER: 1 };
    }
    booking.status = "rejected";
    await booking.save();

    const user = await model.User.findOne({
      where: { id: booking.user_id },
    });
    await sendEmail(
      user.email,
      "Booking Rejected",
      `Your booking has been rejected. Details: ${booking.content}`
    );
    await sendEmail(
      booking.guest_email,
      "Booking approved",
      `Your booking with ${user.name} has been approved. Details: ${booking.content}`
    );

    await booking.destroy();

    return { message: "Booking đã được từ chối và xóa", ER: 0 };
  } catch (error) {
    throw error;
  }
};

export const acceptBookingServicee = async (id) => {
  try {
    const booking = await model.Booking.findByPk(id);

    if (!booking) {
      return { message: "Booking không tồn tại", ER: 1 };
    }
    booking.status = "approved";
    await booking.save();

    const user = await model.User.findOne({
      where: { id: booking.user_id },
    });
    await sendEmail(
      user.email,
      "Booking Approved",
      `Your booking has been approved. Details: ${booking.content}`
    );
    await sendEmail(
      booking.guest_email,
      "Booking Approved",
      `Your booking with ${user.name} has been approved. Details: ${booking.content}`
    );
    return { message: "Booking đã được phê duyệt" };
  } catch (error) {
    throw error;
  }
};
export const getBookingByUserIDService = async (id) => {
  try {
    const bookings = await model.Booking.findAll({
      where: { user_id: id },
    });
    if (!bookings) return { message: "No booking found" };
    return { message: bookings };
  } catch (error) {
    throw error;
  }
};

////////////////////////////////////////// v2
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
