import { useContext, useEffect, useState } from "react";
import "./homepage2.css";
import "./homepage1.css";
import "./form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleRight,
  faBell,
  faCalendar,
  faCircleXmark,
  faL,
  faSquareShareNodes,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import {
  acceptBooking,
  createSchedule,
  deleteSchedule,
  getBooking,
  getScheduleById,
  rejectBooking,
  shareLink,
  updateSchedule,
} from "../../util/api";
import { AuthContext } from "../../context/wrapContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [formDataEdit, setFormDataEdit] = useState({
    id: 0,
    updateTitle: "",
    updateStartTime: "",
    updateEndTime: "",
    updatePriority: "",
    updateNotification_time: false,
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: "",
    notification_time: false,
  });
  const [link, setLink] = useState("");
  const [isShowLink, setIsShowLink] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalBooking, setIsModalBooking] = useState(false);
  const [isModalPending, setIsModalPending] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState(null);
  const [isAppointmentMode, setIsAppointmentMode] = useState(true);
  const [apiSchedules, setApiSchedules] = useState([]);
  useEffect(() => {
    const getInfo = localStorage.getItem("info");
    const user = JSON.parse(getInfo);

    const fetchSchedules = async () => {
      try {
        const response = await getScheduleById(user?.data?.user?.id);
        const schedules = Array.isArray(response.message)
          ? response.message
          : [];
        return schedules.map((schedule) => ({ ...schedule, type: "schedule" }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API (schedules):", error);
        return [];
      }
    };

    const fetchBooking = async () => {
      try {
        const response = await getBooking(user?.data?.user?.id);
        const bookings = Array.isArray(response.message)
          ? response.message
          : [];
        return bookings.map((booking) => ({ ...booking, type: "booking" }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API (bookings):", error);
        return [];
      }
    };

    const fetchAllData = async () => {
      const schedules = await fetchSchedules();
      const bookings = await fetchBooking();
      const combinedData = [...schedules, ...bookings];
      console.log(combinedData);
      setApiSchedules(combinedData);
    };

    if (isFirstLoad) {
      fetchAllData();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsFormVisible(true);
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
  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataEdit((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "startTime") {
    }
  };

  const resetForm = () => {
    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      priority: "",
      notification_time: false,
    });
    setFormDataEdit({
      updateTitle: "",
      updateStartTime: "",
      updateEndTime: "",
      updatePriority: "",
      updateNotification_time: false,
    });
    setIsFormEdit(false);
    setIsFormVisible(false);
  };
  const renderSchedules = (date) => {
    const dateString = date.toLocaleDateString();

    if (!Array.isArray(apiSchedules)) {
      return <div className=""></div>;
    }

    const daySchedules = apiSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_time).toLocaleDateString();
      return scheduleDate === dateString;
    });

    if (daySchedules.length === 0) {
      return <div className=""></div>;
    }

    const displaySchedules = daySchedules.slice(0, 2);
    const remainingCount = daySchedules.length - displaySchedules.length;

    return (
      <div>
        {displaySchedules.map((schedule) => (
          <div
            className={`schedule ${
              schedule.type === "booking"
                ? schedule.status === "approved"
                  ? "approved bg-red-600"
                  : "pending bg-red-900"
                : ""
            }`}
            key={schedule.id}
            onClick={(e) => {
              e.stopPropagation();
              handleScheduleClick(schedule);
            }}
          >
            {schedule.type === "booking" ? schedule.content : schedule.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="schedule">{`Còn ${remainingCount} lịch khác`}</div>
        )}
      </div>
    );
  };

  const handleScheduleClick = (schedule) => {
    if (schedule.type === "booking") {
      console.log("Thông tin booking:", schedule);
      setSelectedBookings(schedule);

      if (schedule.status === "pending") {
        setIsModalPending(true);
      } else if (schedule.status === "approved") {
        setIsModalBooking(true);
      }
    } else if (schedule.type === "schedule") {
      console.log("Thông tin schedule:", schedule);
      setSelectedSchedule(schedule);
      setIsModalVisible(true);
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
          {isAppointmentMode && renderSchedules(currentDate)}
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

  const handleEdit = (schedule) => {
    const start_timee = convertTo12HourFormat(schedule.start_time);
    const end_timee = convertTo12HourFormat(schedule.end_time);
    console.log(schedule.id);
    console.log(start_timee, end_timee, "check starttime endTime");
    setFormDataEdit({
      id: schedule.id,
      updateTitle: schedule.title,
      updateStartTime: start_timee,
      updateEndTime: end_timee || "",
      updatePriority: schedule.priority,
      updateNotification_time: schedule.notification_time,
    });

    updateEndTimeOptions(start_timee);
    setIsFormEdit(true);
    setIsModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteSchedule(id);
      console.log(data);
      if (data.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (prevSchedules) {
            return prevSchedules.filter((schedule) => schedule.id !== id);
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
            return [];
          }
        });
        setIsModalVisible(false);
      }
      console.log("error delete data", data);
    } catch (error) {
      console.log(error);
    }
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
      endTime: "",
    }));

    console.log("Available End Times:", availableEndTimes);
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
  const convertDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const convertTo12HourFormat = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Chuyển sang định dạng 12 giờ

    return `${hours}:${minutes} ${ampm}`;
  };

  const handleShareLink = async () => {
    const user = JSON.parse(localStorage.getItem("info"));
    const userID = user?.data?.user?.id;
    try {
      const getLink = await shareLink(userID);
      console.log(getLink);
      console.log(getLink?.data?.data?.link);
      setLink(getLink?.data?.data?.link);
      setIsShowLink(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = convertDate(selectedDate);
    const startTime = convertTime(formData.startTime);
    const endTime = convertTime(formData.endTime);
    const user_id = JSON.parse(localStorage.getItem("info")).data.user.id;
    const newSchedule = {
      user_id: user_id,
      title: formData.title,
      start_time: `${date}T${startTime}`,
      end_time: `${date}T${endTime}`,
      priority: formData.priority || "low",
      notification_time: formData.notification_time,
    };
    console.log(newSchedule);
    try {
      const result = await createSchedule(newSchedule);
      console.log("Data trước khi call API Create New Schedule", newSchedule);
      console.log(result);
      if (result.status === 200) {
        setIsFirstLoad(true);
        resetForm();
      } else {
        if (result.status === 400) {
          alert("Lịch đã tồn tại, vui lòng chọn lại thời gian");
        } else console.log("Error creating Schedule");
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
    }

    setIsFormVisible(false);
  };

  const handleSumitUpdate = async (e) => {
    e.preventDefault();
    const date = convertDate(selectedSchedule.start_time);

    const startTime = convertTime(formDataEdit.updateStartTime);
    const endTime = convertTime(formDataEdit.updateEndTime);
    const user_id = JSON.parse(localStorage.getItem("info")).data.user.id;
    const id = formDataEdit.id;
    console.log(date);
    const updatedSchedule = {
      id: formDataEdit.id,
      user_id: user_id,
      title: formDataEdit.updateTitle,
      start_time: `${date}T${startTime}`,
      end_time: `${date}T${endTime}`,
      priority: formDataEdit.updatePriority || "low",
      notification_time: formDataEdit.updateNotification_time,
    };

    console.log(updatedSchedule);

    try {
      const result = await updateSchedule(id, updatedSchedule);
      console.log("Data trước khi call API Update Schedule", updatedSchedule);
      console.log(result);

      if (result.status === 200) {
        setApiSchedules((prevSchedules) => {
          if (Array.isArray(prevSchedules)) {
            return prevSchedules.map((schedule) =>
              schedule.id === id
                ? { ...schedule, ...updatedSchedule }
                : schedule
            );
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
          }
        });
        resetForm();
      } else {
        if (result.status === 400) {
          alert("Lịch đã tồn tại, vui lòng chọn lại thời gian");
        } else console.log("Error updating Schedule");
      }
      setIsFormEdit(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch làm việc:", error);
    }

    setIsFormVisible(false);
  };
  const handleRejectBooking = async (booking) => {
    try {
      const data = await rejectBooking(booking.id_booking);
      console.log(data);
      if (data.status === 200) {
        setIsFirstLoad(true);
      }
      setIsModalPending(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptBooking = async (booking) => {
    try {
      const data = await acceptBooking(booking.id_booking);
      console.log(data);
      if (data.status === 200) {
        console.log("ok");
        setApiSchedules((prevSchedules) =>
          prevSchedules.map((item) =>
            item.id === booking.id ? { ...item, status: "approved" } : item
          )
        );

        setIsModalPending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const logOut = () => {
    localStorage.removeItem("info");
    navigate("/");
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

        <button
          className="mr-[55px]"
          onClick={() => setIsAppointmentMode(false)}
        >
          <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "25px" }} />
        </button>
        <button className="" onClick={() => handleShareLink()}>
          <FontAwesomeIcon
            icon={faSquareShareNodes}
            style={{ fontSize: "25px" }}
          />
        </button>
        <button className="ml-[55px] text-xl" onClick={() => logOut()}>
          <FontAwesomeIcon
            icon={faArrowAltCircleRight}
            style={{ fontSize: "25px" }}
          />{" "}
          Logout
        </button>
      </div>
      <div className="grid">{renderCalendar()}</div>
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
                <div>
                  <button
                    className="mr-5 rounded-md border-4 w-20"
                    onClick={() => handleEdit(selectedSchedule)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="rounded-md border-4 w-20"
                    onClick={() => handleDelete(selectedSchedule.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setIsModalBooking(false)}
            >
              &times;
            </button>
            {selectedBookings && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thông tin cuộc hẹn
                </h2>
                <div className="text-left">
                  <p className="text-lg">
                    <span className="font-semibold">Tên khách hàng:</span>{" "}
                    {selectedBookings.guest_name}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedBookings.guest_email}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">
                      Thời gian bắt đầu cuộc hẹn:
                    </span>{" "}
                    {new Date(selectedBookings.start_time).toLocaleString()}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">
                      Thời gian kết thúc cuộc hẹn:
                    </span>{" "}
                    {new Date(selectedBookings.end_time).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setIsModalPending(false)}
            >
              &times;
            </button>
            {selectedBookings && (
              <div className="space-y-4">
                <div className="text-left space-y-3">
                  <p className="font-semibold text-lg">
                    Tên khách: <span>{selectedBookings.guest_name}</span>
                  </p>
                  <p className="font-semibold text-lg">
                    Email: <span>{selectedBookings.guest_email}</span>
                  </p>
                  <p className="font-semibold text-lg">
                    Thời gian:{" "}
                    <span>
                      {new Date(selectedBookings.start_time).toLocaleString()} -{" "}
                      {new Date(selectedBookings.end_time).toLocaleString()}
                    </span>
                  </p>
                  <p className="font-semibold text-lg">
                    Nội dung công việc:{" "}
                    <span>
                      {selectedBookings.content || "Không có nội dung"}
                    </span>
                  </p>
                </div>
                <div className="border-t border-gray-300 mt-4"></div>
                <div className="flex justify-around mt-4">
                  <button
                    className="text-blue-500 font-semibold hover:underline"
                    onClick={() => handleAcceptBooking(selectedBookings)}
                  >
                    Chấp nhận
                  </button>
                  <button
                    className="text-black font-semibold hover:underline"
                    onClick={() => handleRejectBooking(selectedBookings)}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
              <div className="text-xl font-bold">Tiêu đề</div>
              <label className="title-input">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="text-xl font-bold mb-5">Thời Gian</div>
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
              <div className="importance-level">
                <label className="text-xl font-bold">Mức độ quan trọng</label>
                <div className="importance-options">
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handleInputChange}
                    />
                    <span className="high">High</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handleInputChange}
                    />
                    <span className="medium">Medium</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handleInputChange}
                    />
                    <span className="low">Low</span>
                  </label>
                </div>
              </div>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  name="notification_time"
                  checked={formData.notification_time}
                  onChange={handleInputChange}
                />
                Nhận thông báo khi gần đến
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form">OK</button>
            </div>
          </form>
        </div>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {isFormEdit && (
        <div className="form-overlay">
          <form className="schedule-form" onSubmit={handleSumitUpdate}>
            <div className="close-form" onClick={() => resetForm()}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ fontSize: "30px" }}
              />
            </div>
            <div className="form-input">
              <div className="font-bold text-xl">Tiêu đề</div>
              <label className="title-input">
                <input
                  type="text"
                  name="updateTitle"
                  value={formDataEdit.updateTitle}
                  onChange={handleUpdateInputChange}
                  required
                />
              </label>
              <div className="time-input">
                <div className="text-xl font-bold mb-5">Thời Gian</div>
                <select
                  id="updateStartTime"
                  name="updateStartTime"
                  value={formDataEdit.updateStartTime}
                  onChange={(e) => {
                    const selectedStartTime = e.target.value;
                    setFormDataEdit((prevData) => ({
                      ...prevData,
                      updateStartTime: selectedStartTime,
                      updateEndTimeo: "", // Reset endTime khi thay đổi startTime
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
                  id="updateEndTime"
                  name="updateEndTime"
                  value={formDataEdit.updateEndTime}
                  onChange={(e) => {
                    const selectedEndTime = e.target.value;
                    setFormDataEdit((prevData) => ({
                      ...prevData,
                      updateEndTime: selectedEndTime,
                    }));
                  }}
                  required={!!formDataEdit.updateStartTime}
                  disabled={!formDataEdit.updateStartTime} // Chỉ cho phép chọn khi có giá trị startTime
                >
                  <option value="">-- Chọn giờ kết thúc --</option>
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="importance-level">
                <label className="font-bold text-xl mt-5">
                  Mức độ quan trọng
                </label>
                <div className="importance-options">
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="high"
                      checked={formDataEdit.updatePriority === "high"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="high">High</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="medium"
                      checked={formDataEdit.updatePriority === "medium"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="medium">Medium</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="low"
                      checked={formDataEdit.updatePriority === "low"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="low">Low</span>
                  </label>
                </div>
              </div>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  name="updateNotification_time"
                  checked={formDataEdit.updateNotification_time}
                  onChange={handleUpdateInputChange}
                />
                <p>Nhận thông báo khi gần đến</p>
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form font-bold text-xl">Update</button>
            </div>
          </form>
        </div>
      )}
      {isShowLink && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsShowLink(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-center mb-4">
              Shared Link Calendar
            </h2>
            <p className="text-center mt-4 font-semibold border">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
