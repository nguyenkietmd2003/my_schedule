import { sequelize } from "../config/database.js";
import initModels from "./../models/init-models.js";
import { createToken } from "./../config/jwt.js";
import { sendEmail } from "./sendEmailService.js";

let model = initModels(sequelize);

export const getUserInfoService = async (user_id) => {
  try {
    const user = await model.User.findByPk(user_id);
    if (!user) throw new Error("User not found");
    return { data: user };
  } catch (error) {
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////
export const sendOtpService = async (email) => {
  try {
    // Kiểm tra email của người dùng trong bảng User
    const user = await model.User.findAll({ where: { email } });

    if (user.length > 0) {
      return { message: "Email  tồn tại", ER: 3 };
    }

    // Tạo OTP ngẫu nhiên

    // Kiểm tra xem OTP đã tồn tại cho email trong bảng otp chưa
    const existingOtp = await model.OTP.findOne({
      where: { email }, // Kiểm tra trực tiếp email trong bảng otp
    });
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (existingOtp) {
      // Gửi email OTP
      await sendEmail(
        email,
        `OTP xác nhận đăng ký`,
        `Mã OTP của bạn là: ${otp}`
      );
      // Nếu OTP đã tồn tại, cập nhật OTP mới và gia hạn thời gian hết hạn
      await existingOtp.update({
        otp,
        expired_at: new Date(Date.now() + 10 * 60000), // Thời gian hết hạn là 10 phút
      });
      return { message: "Cập nhật OTP thành công", ER: 1 };
    }

    // Nếu không có OTP, tạo OTP mới và lưu vào cơ sở dữ liệu
    const newOtp = await model.OTP.create({
      email, // Lưu email của người dùng
      otp,
      expired_at: new Date(Date.now() + 10 * 60000), // Thời gian hết hạn là 10 phút
    });

    return { message: newOtp, ER: 0 };
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    throw error;
  }
};

export const registerServicee = async (email, otp, password, name) => {
  try {
    // Kiểm tra nếu email đã tồn tại trong bảng User
    const user = await model.User.findOne({ where: { email } });
    if (user) {
      return { message: "Email đã tồn tại", ER: 3 }; // Trả về lỗi nếu email đã tồn tại
    }

    // Kiểm tra OTP trong bảng otp
    const otpRecord = await model.OTP.findOne({ where: { email } });
    if (!otpRecord) {
      return {
        message: "Không tìm thấy OTP cho người dùng này, xác thực thất bại",
        ER: 5,
      };
    }

    // Kiểm tra OTP có hợp lệ không
    if (otpRecord.otp != otp) {
      console.log(otpRecord.otp, otp);
      return { message: "OTP không hợp lệ", ER: 4 };
    }

    // Kiểm tra OTP có hết hạn không
    if (new Date() > otpRecord.expired_at) {
      return { message: "OTP đã hết hạn", ER: 2 };
    }

    // Xóa OTP sau khi xác thực thành công
    await otpRecord.destroy();

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu

    // Tạo người dùng mới sau khi OTP hợp lệ
    const newUser = await model.User.create({
      email,
      password,
      name,
    });

    return { message: newUser, ER: 0 };
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    throw error;
  }
};

export const loginService = async (email, password) => {
  try {
    const checkEmail = await model.User.findOne({
      where: { email },
    });
    if (checkEmail) {
      if (checkEmail.password === password) {
        const user = {
          id: checkEmail.id,
          name: checkEmail.name,
          email: checkEmail.email,
        };
        const token = createToken(user);
        return { token: token, user: user };
      }
    }
    throw new Error("Couldn't find user");
  } catch (error) {
    throw error;
  }
};
