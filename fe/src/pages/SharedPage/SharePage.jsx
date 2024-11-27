import { useContext, useEffect, useState } from "react";
import {
  booking,
  bookingg,
  getInfoByLink,
  sendOtp,
  sendOtpBooking,
} from "../../util/api";
import { useParams } from "react-router-dom";
import "../homepage/homepage1.css";
import "../homepage/homepage2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/wrapContext";

const SharePage = () => {
  const { translations, setLanguage } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Bangkok");
  const [selectedLanguage, setSelectedLanguage] = useState("VN");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    content: "",
  });
  const [formDataOTP, setFormDataOTP] = useState({
    otp: null,
  });
  const [isFormVerifyEmail, setIsFormVerifyEmail] = useState(false);
  const [selectSchedule, setSelectSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [infoUser, setInfoUser] = useState({
    name: "",
    email: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessNotificationVisible, setIsSuccessNotificationVisible] =
    useState(false);

  //////
  const [apiSchedules, setApiSchedules] = useState([]);
  const { randomString } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfoByLink(randomString);
        console.log(data);
        const schedule = data?.data?.schedule || [];
        const userInfo = data?.data?.getUser || null;
        console.log(userInfo);
        setApiSchedules(schedule);
        setInfoUser(userInfo);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const gotoNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleInputOtpChange = (e) => {
    const { name, value } = e.target;
    setFormDataOTP((prevData) => ({
      ...prevData,
      [name]: name === "otp" ? Number(value) : value, // Chuyển value thành number nếu là otp
    }));
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const daysOfWeek = ["CN", "TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7"];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const calendarDays = [];

    // Lấy ngày hiện tại
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Lọc các ngày có lịch trình
    const scheduledDays = getScheduledDays();

    // Render tiêu đề các ngày trong tuần
    calendarDays.push(
      ...daysOfWeek.map((day, index) => (
        <div key={`day-${index}`} className="day header-day">
          {day}
        </div>
      ))
    );

    // Các ngày từ tháng trước (ô trống đầu lịch)
    for (let i = startDay; i > 0; i--) {
      const lastMonthDate = new Date(currentYear, currentMonth, 0);
      calendarDays.push(
        <div key={`empty-${i}`} className="day empty">
          {`${lastMonthDate.getDate() - i + 1}/${lastMonthDate.getMonth() + 1}`}
        </div>
      );
    }

    // Các ngày trong tháng hiện tại
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);

      // Kiểm tra nếu là ngày hiện tại
      const isToday =
        currentDate.getDate() === todayDate &&
        currentDate.getMonth() === todayMonth &&
        currentDate.getFullYear() === todayYear;

      // Kiểm tra xem ngày có lịch trình không
      const isScheduledDay = scheduledDays.includes(
        currentDate.toLocaleDateString()
      );

      calendarDays.push(
        <div
          key={currentDate.toISOString()}
          className={`day ${isToday ? "today" : ""} ${
            isScheduledDay ? "has-schedule" : ""
          }`}
          onClick={isScheduledDay ? () => handleDayClick(currentDate) : null}
        >
          {currentDate.getDate()}
        </div>
      );
    }

    // Các ngày từ tháng sau (ô trống cuối lịch)
    const remainingDays = (7 - ((totalDays + startDay) % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      calendarDays.push(
        <div key={`next-month-${i}`} className="day empty">
          {`${nextMonthDate.getDate()} thg ${nextMonthDate.getMonth() + 1}`}
        </div>
      );
    }

    return calendarDays;
  };
  const handleDayClick = (date) => {
    // Lọc các lịch trình cho ngày đã chọn
    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleStartDate = new Date(
        schedule.free_time_start
      ).toLocaleDateString(); // Chuyển đổi ngày bắt đầu
      return scheduleStartDate === date.toLocaleDateString(); // So sánh ngày
    });
    console.log(daySchedules);
    console.log(date);

    setSelectedDate(date); // Lưu ngày được chọn
    setSelectedSchedule(daySchedules); // Lưu lịch trình cho ngày đó
    setShowModal(true); // Hiển thị modal
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleScheduleSelect = (schedule) => {
    console.log("Selected schedule:", schedule);
    setIsModalVisible(true);
    setSelectSchedule(schedule);
    // Xử lý khi người dùng chọn một lịch trình, ví dụ: Đặt lịch, thông báo, v.v.
    closeModal(); // Đóng modal sau khi chọn
  };
  // Hàm lấy danh sách các ngày có lịch trình
  const getScheduledDays = () => {
    // Ngày hiện tại theo định dạng địa phương
    const today = new Date();

    // Kiểm tra xem apiSchedules có phải là một mảng không
    if (!Array.isArray(apiSchedules)) {
      return [];
    }

    // Lọc lịch trình theo ngày
    const scheduledDays = apiSchedules.map((schedule) => {
      const scheduleStartDate = new Date(
        schedule.free_time_start
      ).toLocaleDateString();
      return scheduleStartDate;
    });

    // Loại bỏ các ngày trùng lặp
    return [...new Set(scheduledDays)];
  };

  const resetForm = () => {
    setFormData({
      startTime: "",
      endTime: "",
      name: "",
      email: "",
      content: "",
    });
    setFormDataOTP({ otp: "" });
    setIsFormVisible(false);
    setIsFormVerifyEmail(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { guest_email: formData.email };
    try {
      const result = await sendOtpBooking(data);
      console.log(result);
      if (result.data.ER == 0) {
        setIsFormVerifyEmail(true);
      } else {
        alert("Đặt lịch không thành công, trùng thời gian bận của khách hàng");
        console.log("Error creating Schedule");
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
    }
    setIsFormVisible(false);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const newBooking = {
      free_time_config_id: selectSchedule.id,
      guest_name: formData.name,
      guest_email: formData.email,
      content: formData.content,
      name_company: formData.company,
      verificationCode: formDataOTP.otp,
    };
    try {
      console.log("bookig", newBooking);
      const result = await bookingg(newBooking);
      console.log(result);
      if (result.data.ER == 0) {
        resetForm();
        setIsSuccessNotificationVisible(true);
      } else {
        alert("Mã sác thực không đúng");
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
    }
    resetForm();
    setIsFormVisible(false);
  };

  const handleClickBooking = () => {
    setIsFormVisible(true);
    setIsModalVisible(false);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setLanguage(newLang);
  };
  const handleButtonClick = () => {
    setIsModalOpen(true); // Mở modal
  };

  const closeModalUser = () => {
    setIsModalOpen(false); // Đóng modal
  };
  const timeZones = ["Asia/Bangkok", "Asia/Kolkata", "Asia/Tokyo"];
  const handleTimeZoneChange = (e) => {
    setSelectedTimeZone(e.target.value); // Cập nhật state khi người dùng chọn múi giờ mới
  };

  return (
    <div className="calendar">
      <div className="header">
        <button
          className="font-bold px-4 py-2 text-2xl underline"
          onClick={handleButtonClick}
        >
          {infoUser ? `${infoUser.name} Calendar` : "Loading..."}
        </button>

        <button className="month-button previous" onClick={goToPreviousMonth}>
          &#60;
        </button>
        <h1> {`${translations.month} ${currentMonth + 1}, ${currentYear}`}</h1>
        <button className="month-button next" onClick={gotoNextMonth}>
          &#62;
        </button>
        <select
          className="ml-4 border p-2 rounded"
          value={selectedTimeZone}
          onChange={handleTimeZoneChange}
        >
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>

        <select
          className="ml-4 p-2 border rounded"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="vn">Tiếng Việt</option>
          <option value="en">Tiếng Anh</option>
        </select>
      </div>

      <div className="grid">{renderCalendar()}</div>
      {/* <div className="flex justify-center">
        <div>Chính sách quyền riêng tư và cookies</div>
      </div> */}
      <div className="bg-gray-100 text-gray-800 py-6 border border-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            {/* Section 1: Logo or Title */}
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">📅 Calendar App</h2>
              <p className="text-sm">Plan your days, organize your life.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Privacy and Cookies</h3>
              <button
                onClick={() => alert("Privacy and Cookies Policy")}
                className="mt-2 p-2 bg-slate-400 hover:bg-slate-600 text-white rounded-md"
              >
                View Policy
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-black pt-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Calendar App. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/*  */}
      {isFormVisible && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSubmit}>
            <div className="close-form" onClick={() => resetForm()}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ fontSize: "30px" }}
              />
            </div>
            <div className="form-input">
              <div className="font-bold text-xl">Tên của bạn</div>
              <label className="title-input">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="font-bold text-xl">Email</div>

              <label className="title-input">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="font-bold text-xl"> Nội dung cuộc họp</div>
              <label className="title-input">
                <input
                  type="text"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="font-bold text-xl">Tên Công Ty</div>
              <label className="title-input">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form">Gửi</button>
            </div>
          </form>
        </div>
      )}
      {isFormVerifyEmail && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSubmitBooking}>
            <div className="close-form" onClick={() => resetForm()}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ fontSize: "30px" }}
              />
            </div>
            <div className="form-input">
              <div className="font-bold text-xl">Xác thực OTP</div>
              <label className="title-input">
                <input
                  type="number"
                  name="otp"
                  value={formDataOTP.otp}
                  onChange={handleInputOtpChange}
                  required
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form">Gửi</button>
            </div>
          </form>
        </div>
      )}
      {isSuccessNotificationVisible && (
        <div className="notification-success">
          <div className="notification-success-content">
            <p>Bạn đã đặt lịch thành công</p>
            <p>Chờ phê duyệt nhé!</p>
            <button onClick={() => setIsSuccessNotificationVisible(false)}>
              OK
            </button>
          </div>
        </div>
      )}
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalVisible(false)}>
              &times;
            </span>
            {selectSchedule && (
              <div>
                <p>
                  <strong>Lịch Rảnh</strong>
                </p>

                <p>
                  <strong>Thời gian bắt đầu:</strong>{" "}
                  {new Date(selectSchedule.free_time_start).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Thời gian kết thúc:</strong>{" "}
                  {new Date(selectSchedule.free_time_end).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-1 rounded-md mt-1"
                  onClick={() => handleClickBooking(true)}
                >
                  Đặt lịch
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thông tin người dùng</h2>
            {infoUser ? (
              <ul>
                <li>Tên: {infoUser.name}</li>
                <li>Email: {infoUser.email}</li>
              </ul>
            ) : (
              <p>Loading...</p>
            )}
            <button
              className="rounded border font-bold bg-blue-400 px-4 py-2 mt-4"
              onClick={closeModalUser}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              ×
            </span>
            <h3>
              Lựa chọn thời gian rảnh cho ngày{" "}
              {selectedDate.toLocaleDateString()}
            </h3>
            {selectedSchedule.length === 0 ? (
              <p>Không có lịch trình nào cho ngày này.</p>
            ) : (
              <div>
                {selectedSchedule.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="schedule-option px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-600 w-fit"
                    onClick={() => handleScheduleSelect(schedule)}
                  >
                    {`${new Date(schedule.free_time_start).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: selectedTimeZone, // Áp dụng múi giờ được chọn
                      }
                    )} - ${new Date(schedule.free_time_end).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: selectedTimeZone, // Áp dụng múi giờ được chọn
                      }
                    )}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SharePage;
