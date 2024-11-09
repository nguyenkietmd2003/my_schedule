import nodemailer from "nodemailer";

// Cấu hình dịch vụ email (Sử dụng Gmail hoặc dịch vụ khác)
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc sử dụng host và port cho dịch vụ khác
  auth: {
    user: "nguyentuankietmd04092003@gmail.com", // Địa chỉ email của bạn
    pass: "thbn moqa jpxq yukt", // Mật khẩu ứng dụng (hoặc mật khẩu email)
  },
});

// Hàm gửi email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "nguyentuankietmd04092003@gmail.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, message: "Failed to send email" };
  }
};
