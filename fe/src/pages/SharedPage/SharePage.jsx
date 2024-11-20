import { useEffect, useState } from "react";
import { booking, bookingg, getInfoByLink } from "../../util/api";
import { useParams } from "react-router-dom";
import "../homepage/homepage1.css";
import "../homepage/homepage2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const SharePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    content: "",
  });
  const [selectSchedule, setSelectSchedule] = useState(null);
  const [userID, setUserID] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
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
        setApiSchedules(schedule);
        console.log(schedule);

        const userId = schedule.length > 0 ? schedule[0].user_id : 0;
        console.log("id", userId);
        setUserID(userId);
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

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
    const dateString = today.toLocaleDateString();

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
    setIsFormVisible(false);
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const convertTime = (time12h) => {
    const regex = /(\d{1,2}):(\d{2})\s?(AM|PM)/i;
    const match = time12h.trim().match(regex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const time24h = `${hours.toString().padStart(2, "0")}:${minutes}:00`;
      return time24h;
    } else {
      console.log("Loi Convert time");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(selectedSchedule);
    const newBooking = {
      free_time_config_id: selectSchedule.id,
      guest_name: formData.name,
      guest_email: formData.email,
      content: formData.content,
      name_company: formData.company,
    };
    try {
      const result = await bookingg(newBooking);
      console.log("Data trước khi call API booking ", newBooking);
      console.log(result);
      if (result.status === 200) {
        setIsSuccessNotificationVisible(true);
        resetForm();
      } else {
        if (result.status === 400) {
          alert(
            "Đặt lịch không thành công, trùng thời gian bận của khách hàng"
          );
        }
        console.log("Error creating Schedule");
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

  return (
    <div className="calendar">
      <div className="header">
        <button className="month-button previous" onClick={goToPreviousMonth}>
          &#60;
        </button>
        <h1> {`Tháng ${currentMonth + 1}, ${currentYear}`}</h1>
        <button className="month-button next" onClick={gotoNextMonth}>
          &#62;
        </button>
        <button className="appointment border w-[110px] h-[30px] rounded-2xl mr-[55px]">
          Lịch Hẹn
        </button>
      </div>
      <div className="grid">{renderCalendar()}</div>
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

              <div className="font-bold text-xl"> Nội dung</div>
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
                    className="schedule-option"
                    onClick={() => handleScheduleSelect(schedule)}
                  >
                    {`${new Date(schedule.free_time_start).toLocaleTimeString(
                      "vi-VN",
                      { hour: "2-digit", minute: "2-digit" }
                    )} -${new Date(schedule.free_time_end).toLocaleTimeString(
                      "vi-VN",
                      { hour: "2-digit", minute: "2-digit" }
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
