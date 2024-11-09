import { useEffect, useState } from "react";
import { booking, getInfoByLink } from "../../util/api";
import { useParams } from "react-router-dom";
import "../homepage/homepage1.css";
import "../homepage/homepage2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const SharePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startTime: "",
    endTime: "",
    content: "",
  });
  const [userID, setUserID] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAppointmentMode, setIsAppointmentMode] = useState(false);
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
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsFormVisible(true);
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
    if (name === "startTime") {
    }
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

    calendarDays.push(
      ...daysOfWeek.map((day, index) => (
        <div key={`day-${index}`} className="day header-day">
          {day}
        </div>
      ))
    );

    for (let i = startDay; i > 0; i--) {
      const lastMonthDate = new Date(currentYear, currentMonth, 0);
      calendarDays.push(
        <div key={`empty-${i}`} className="day empty">
          {`${lastMonthDate.getDate() - i + 1}/${lastMonthDate.getMonth()}`}
        </div>
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      calendarDays.push(
        <div
          key={currentDate.toISOString()}
          className="day"
          onClick={() => handleDateClick(currentDate)}
        >
          {currentDate.getDate()}
          {renderSchedules(currentDate)}
        </div>
      );
    }

    const remainingDays = (7 - ((totalDays + startDay) % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      const day = nextMonthDate.getDate(); // Ngày trong tháng kế tiếp
      const month = nextMonthDate.getMonth() + 1; // Tháng kế tiếp (tăng 1 do getMonth() trả về từ 0-11)

      calendarDays.push(
        <div key={`next-month-${i}`} className="day empty">
          {`${day} thg ${month}`}
        </div>
      );
    }

    return calendarDays;
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
  const populateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const minutes = ["00", "30"];

      minutes.forEach((minute) => {
        const timeOption = `${displayHour}:${minute} ${period}`;
        times.push(timeOption);
      });
    }
    return times;
  };

  const timeOptions = populateTimeOptions();

  const updateEndTimeOptions = (selectedStartTime) => {
    const startIndex = timeOptions.findIndex(
      (time) => time === selectedStartTime
    );

    const availableEndTimes = timeOptions.filter(
      (time, index) => index > startIndex
    );

    setEndTimeOptions(availableEndTimes);

    setFormData((prevData) => ({
      ...prevData,
      endTime: "", // Reset endTime to an empty string
    }));

    console.log("Available End Times:", availableEndTimes);
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
    const date = convertDate(selectedDate);
    const startTime = convertTime(formData.startTime);
    const endTime = convertTime(formData.endTime);
    const newSchedule = {
      user_id: userID,
      guest_name: formData.name,
      guest_email: formData.email,
      start_time: `${date}T${startTime}`,
      end_time: `${date}T${endTime}`,
      content: formData.content,
    };
    try {
      const result = await booking(newSchedule);
      console.log("Data trước khi call API booking ", newSchedule);
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
  const renderSchedules = (date) => {
    // Ngày hiện tại theo định dạng địa phương
    const dateString = date.toLocaleDateString();

    // Kiểm tra xem apiSchedules có phải là một mảng không
    if (!Array.isArray(apiSchedules)) {
      return <div className=""></div>;
    }

    // Lọc lịch trình theo ngày
    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time).toLocaleDateString(); // Chuyển đổi ngày từ lịch trình
      return scheduleDate === dateString; // So sánh ngày
    });

    // Kiểm tra nếu không có lịch trình nào trong ngày
    if (daySchedules.length === 0) {
      return <div className=""></div>;
    }

    // Chọn tối đa 2 lịch trình để hiển thị
    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - displaySchedules.length; // Tính số lịch trình còn lại

    return (
      <div>
        {displaySchedules.map((schedule, index) => (
          <div
            className="schedule"
            key={index}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn chặn sự kiện click từ propagating lên thẻ cha
              handleScheduleClick(schedule); // Gọi hàm xử lý sự kiện click
            }}
          >
            {schedule.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
        )}
      </div>
    );
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
        <button
          className="appointment border w-[110px] h-[30px] rounded-2xl mr-[55px]"
          onClick={() => setIsAppointmentMode(true)}
        >
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
              <div className="font-bold text-xl">Thời Gian</div>
              <div className="time-input mb-5">
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={(e) => {
                    const selectedStartTime = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      startTime: selectedStartTime,
                      endTime: "", // Reset endTime khi thay đổi startTime
                    }));
                    updateEndTimeOptions(selectedStartTime);
                  }}
                  required
                >
                  <option value="">-- Chọn giờ bắt đầu --</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={(e) => {
                    const selectedEndTime = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      endTime: selectedEndTime,
                    }));
                  }}
                  required={!!formData.startTime}
                  disabled={!formData.startTime} // Chỉ cho phép chọn khi có giá trị startTime
                >
                  <option value="">-- Chọn giờ kết thúc --</option>
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
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
            {selectedSchedule && (
              <div>
                <p>
                  <strong>Tiêu đề:</strong> {selectedSchedule.title}
                </p>
                <p>
                  <strong>Thời gian bắt đầu:</strong>{" "}
                  {new Date(selectedSchedule.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>Thời gian kết thúc:</strong>{" "}
                  {new Date(selectedSchedule.end_time).toLocaleString()}
                </p>
                <p>
                  <strong>Ưu tiên:</strong> {selectedSchedule.priority}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SharePage;
