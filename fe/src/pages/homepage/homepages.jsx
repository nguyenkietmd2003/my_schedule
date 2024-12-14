import { useContext, useEffect, useState } from "react";
import "./homepage2.css";
import "./homepage1.css";
import "./form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleXmark,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  acceptbookingg,
  createSchedule,
  deleteFreeTime,
  deleteSchedule,
  getBooking,
  getFreeTimeByUser,
  getScheduleById,
  rejectBookingg,
  shareLink,
  updateSchedule,
} from "../../util/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/wrapContext";

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
  const { translations, setLanguage, language } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: "",
    notification_time: false,
  });
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Bangkok"); // Giá trị mặc định là "Asia/Bangkok"

  const [selectedLanguage, setSelectedLanguage] = useState("VN");
  const [link, setLink] = useState("");
  const [isShowLink, setIsShowLink] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedFreeTime, setSelectedFreeTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFreeTimeModalVisible, setIsFreeTimeModalVisible] = useState(false);
  const [isModalBooking, setIsModalBooking] = useState(false);
  const [isModalPending, setIsModalPending] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState(null);
  const [apiSchedules, setApiSchedules] = useState([]);
  const [selectedRemainingSchedules, setSelectedRemainingSchedules] = useState(
    []
  );
  const [
    isRemainingSchedulesModalVisible,
    setIsRemainingSchedulesModalVisible,
  ] = useState(false);

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

    const fecthFreeTime = async () => {
      try {
        const response = await getFreeTimeByUser(user?.data?.user?.id);

        // Dữ liệu API là một mảng, không cần phải truy cập message
        const freeTimes = Array.isArray(response.data.message)
          ? response.data.message
          : [];

        // Nếu cần, bạn có thể map dữ liệu để thêm type vào từng đối tượng
        return freeTimes.map((freeTime) => ({ ...freeTime, type: "freeTime" }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API (FreeTime):", error);
        return [];
      }
    };

    const fetchAllData = async () => {
      const schedules = await fetchSchedules();
      const bookings = await fetchBooking();
      const freeTimes = await fecthFreeTime();
      const combinedData = [...schedules, ...bookings, ...freeTimes];
      console.log(combinedData);
      setApiSchedules(combinedData);
    };
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`Múi giờ hiện tại của bạn: ${timeZone}`);
    if (isFirstLoad) {
      setSelectedLanguage(language);
      fetchAllData();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const timeZones = ["Asia/Bangkok", "Asia/Kolkata", "Asia/Tokyo"];

  const handleTimeZoneChange = (e) => {
    setSelectedTimeZone(e.target.value);
  };
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
  const handleRemainingSchedulesClick = (e, daySchedules) => {
    e.stopPropagation();
    setSelectedRemainingSchedules(daySchedules);
    setIsRemainingSchedulesModalVisible(true);
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
    } else if (schedule.type === "freeTime") {
      console.log("Thông tin freeTime:", schedule);
      setSelectedFreeTime(schedule);
      setIsFreeTimeModalVisible(true);
    }
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
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
  const handleDeleteFreeTime = async (freeTimeId) => {
    try {
      const data = await deleteFreeTime(freeTimeId);
      // console.log(data.message.ER);
      if (data.message.ER == 1) {
        alert(
          "không thể xóa lịch vì đang tồn tại trong bảng booking ( đang có người đặt)"
        );
      }
      if (data.message.ER == 0) {
        setApiSchedules((prevSchedules) => {
          if (prevSchedules) {
            return prevSchedules.filter(
              (schedule) => schedule.id !== freeTimeId
            );
          } else {
            console.error("prevSchedules is not an array", prevSchedules);
            return [];
          }
        });
      }
      setIsFreeTimeModalVisible(false);
      setSelectedFreeTime(null);
    } catch (error) {
      console.log(error);
    }
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
      const data = await rejectBookingg(booking.id);
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
      const data = await acceptbookingg(booking.id);
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
  const renderSchedules = (date) => {
    const dateString = date.toLocaleDateString("vi-VN");
    if (!Array.isArray(apiSchedules)) {
      return <div className=""></div>;
    }

    const options = { timeZone: selectedTimeZone };

    const daySchedules = apiSchedules.filter((schedule) => {
      let scheduleDate = "";
      if (schedule.type === "freeTime") {
        scheduleDate = new Date(schedule.free_time_start).toLocaleDateString(
          "vi-VN",
          options
        );
      } else if (schedule.type === "schedule") {
        scheduleDate = new Date(schedule.start_time).toLocaleDateString(
          "vi-VN",
          options
        );
      } else if (schedule.type === "booking") {
        scheduleDate = new Date(schedule.start_time).toLocaleDateString(
          "vi-VN",
          options
        );
      }
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
                  ? "approved"
                  : schedule.status === "pending"
                  ? "pending"
                  : "" // Nếu không phải "approved" hoặc "pending"
                : schedule.type === "freeTime"
                ? "freetime" // Lớp cho "freeTime"
                : "" // Nếu không phải "booking" hoặc "freeTime"
            }`}
            key={schedule.id}
            onClick={(e) => {
              e.stopPropagation();
              handleScheduleClick(schedule);
            }}
          >
            {schedule.type === "booking" ? (
              schedule.status === "pending" ? (
                <span>{translations["confirm_appointment"]}</span>
              ) : (
                `${translations.appointment_with}: ${schedule.guest_name}`
              )
            ) : schedule.type === "freeTime" ? (
              `${translations.available}:` +
              new Date(schedule.free_time_start).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: selectedTimeZone, // Áp dụng múi giờ
              }) +
              " - " +
              new Date(schedule.free_time_end).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: selectedTimeZone, // Áp dụng múi giờ
              })
            ) : (
              schedule.title +
              " - " +
              new Date(schedule.start_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: selectedTimeZone, // Áp dụng múi giờ
              })
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className="schedule"
            onClick={(e) => handleRemainingSchedulesClick(e, daySchedules)}
          >
            {translations["remaining_appointments"].replace(
              "{remainingCount}",
              remainingCount
            )}
          </div>
        )}
      </div>
    );
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

      calendarDays.push(
        <div
          key={currentDate.toISOString()}
          className={`day ${isToday ? "today" : ""}`}
          onClick={() => handleDateClick(currentDate)}
        >
          {currentDate.getDate()}
          {renderSchedules(currentDate)}
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

  //
  const handleFreeTime = () => {
    navigate("/freeTime");
  };
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <div className="calendar">
      <div className="header">
        <button className="month-button previous" onClick={goToPreviousMonth}>
          &#60;
        </button>
        <h1> {`${translations.month} ${currentMonth + 1}, ${currentYear}`}</h1>
        <button className="month-button next" onClick={gotoNextMonth}>
          &#62;
        </button>
        <button onClick={() => handleShareLink()}>
          <FontAwesomeIcon
            icon={faShareFromSquare}
            style={{ fontSize: "25px" }}
          />
          {translations.shared_link}
        </button>
        <button className="ml-4 " onClick={() => handleFreeTime()}>
          <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "25px" }} />
          {translations.free_time}
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

        <button
          className="ml-4 px-4 py-2 text-xl font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 "
          onClick={() => logOut()}
        >
          {translations.logout}
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
                  <strong>{translations.title}:</strong>{" "}
                  {selectedSchedule.title}
                </p>
                <p>
                  <strong>{translations.start_time}:</strong>{" "}
                  {new Date(selectedSchedule.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>{translations.end_time}:</strong>{" "}
                  {new Date(selectedSchedule.end_time).toLocaleString()}
                </p>
                <p>
                  <strong>{translations.priority}:</strong>{" "}
                  {selectedSchedule.priority}
                </p>
                <div>
                  <button
                    className="mr-5 rounded-md border-4 w-20"
                    onClick={() => handleEdit(selectedSchedule)}
                  >
                    {translations.edit}
                  </button>
                  <button
                    className="rounded-md border-4 w-20"
                    onClick={() => handleDelete(selectedSchedule.id)}
                  >
                    {translations.delete}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/*  */}
      {isFreeTimeModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setIsFreeTimeModalVisible(false)}
            >
              &times;
            </span>
            {selectedFreeTime && (
              <div>
                <p>{translations.free_time_config}</p>
                <p>{translations.free_time_configuration}</p>
                <p>
                  <strong>{translations.start_time}:</strong>{" "}
                  {new Date(selectedFreeTime.free_time_start).toLocaleString()}
                </p>
                <p>
                  <strong>{translations.end_time}:</strong>{" "}
                  {new Date(selectedFreeTime.free_time_end).toLocaleString()}
                </p>
                <div>
                  <button
                    className="rounded-md border-4 w-20"
                    onClick={() => handleDeleteFreeTime(selectedFreeTime.id)}
                  >
                    {translations.delete}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/*  */}
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
                  {translations["appointment_info"]}{" "}
                  {/* Dịch thông tin cuộc hẹn */}
                </h2>
                <div className="text-left">
                  <p className="text-lg">
                    <span className="font-semibold">
                      {translations["guest_name"]}:
                    </span>{" "}
                    {selectedBookings.guest_name}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">
                      {translations["email"]}:
                    </span>{" "}
                    {selectedBookings.guest_email}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">
                      {translations["start_time"]}:
                    </span>{" "}
                    {new Date(selectedBookings.start_time).toLocaleString(
                      language === "en" ? "en-US" : "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">
                      {translations["end_time"]}:
                    </span>{" "}
                    {new Date(selectedBookings.end_time).toLocaleString(
                      language === "en" ? "en-US" : "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
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
                    {translations["guest_name"]}:{" "}
                    <span>{selectedBookings.guest_name}</span>
                  </p>
                  <p className="font-semibold text-lg">
                    {translations["email"]}:{" "}
                    <span>{selectedBookings.guest_email}</span>
                  </p>
                  <p className="font-semibold text-lg">
                    {translations["time"]}:{" "}
                    <span>
                      {new Date(selectedBookings.start_time).toLocaleString(
                        language === "en" ? "en-US" : "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(selectedBookings.end_time).toLocaleString(
                        language === "en" ? "en-US" : "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </span>
                  </p>
                  <p className="font-semibold text-lg">
                    {translations["task_content"]}:{" "}
                    <span>
                      {selectedBookings.content || translations["no_content"]}
                    </span>
                  </p>
                </div>
                <div className="border-t border-gray-300 mt-4"></div>
                <div className="flex justify-around mt-4">
                  <button
                    className="text-blue-500 font-semibold hover:underline"
                    onClick={() => handleAcceptBooking(selectedBookings)}
                  >
                    {translations["accept"]}
                  </button>
                  <button
                    className="text-black font-semibold hover:underline"
                    onClick={() => handleRejectBooking(selectedBookings)}
                  >
                    {translations["reject"]}
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
              <div className="text-xl font-bold">{translations["title"]}</div>
              <label className="title-input">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="text-xl font-bold mb-5">
                {translations["time"]}
              </div>
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
                  <option value="">{translations["select_start_time"]}</option>
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
                  <option value="">{translations["select_end_time"]}</option>
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="importance-level">
                <label className="text-xl font-bold">
                  {translations["priority_level"]}
                </label>
                <div className="importance-options">
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handleInputChange}
                    />
                    <span className="high">{translations["high"]}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handleInputChange}
                    />
                    <span className="medium">{translations["medium"]}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handleInputChange}
                    />
                    <span className="low">{translations["low"]}</span>
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
                {translations["notification_text"]}
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form">{translations["update"]}</button>
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
              <div className="font-bold text-xl">{translations["title"]}</div>
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
                <div className="text-xl font-bold mb-5">
                  {" "}
                  {translations["time"]}
                </div>
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
                  <option value="">{translations["select_start_time"]}</option>
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
                  <option value="">{translations["select_end_time"]}</option>
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="importance-level">
                <label className="font-bold text-xl mt-5">
                  {translations["priority_level"]}
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
                    <span className="high">{translations["high"]}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="medium"
                      checked={formDataEdit.updatePriority === "medium"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="medium">{translations["medium"]}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="updatePriority"
                      value="low"
                      checked={formDataEdit.updatePriority === "low"}
                      onChange={handleUpdateInputChange}
                    />
                    <span className="low">{translations["low"]}</span>
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
                <p>{translations.notification_text}</p>
              </label>
            </div>
            <div className="flex justify-end">
              <button className="button-form font-bold text-xl">
                {translations["update"]}
              </button>
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
              {translations.my_link}
            </h2>
            <p className="text-center mt-4 font-semibold border">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </p>
          </div>
        </div>
      )}
      {isRemainingSchedulesModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <ul>
              {selectedRemainingSchedules.map((schedule) => (
                <li key={schedule.id} className="mb-2">
                  <button
                    className={`w-full py-2 px-4 rounded border text-white ${
                      schedule.type === "booking"
                        ? schedule.status === "pending"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : schedule.status === "approved"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 hover:bg-gray-500"
                        : schedule.type === "freeTime"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : schedule.type === "schedule"
                        ? "bg-red-600"
                        : "bg-gray-300"
                    }`}
                    onClick={() => {
                      handleScheduleClick(schedule);
                      setIsRemainingSchedulesModalVisible(false);
                    }} // Thêm hành động khi click vào schedule
                  >
                    {schedule.type === "booking" ? (
                      schedule.status === "pending" ? (
                        <span>{translations.confirm_appointment}</span>
                      ) : (
                        `${translations.appointment_with} : ${schedule.guest_name}`
                      )
                    ) : schedule.type === "freeTime" ? (
                      `${translations.available} ` +
                      new Date(schedule.free_time_start).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      ) +
                      " - " +
                      new Date(schedule.free_time_end).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    ) : (
                      schedule.title +
                      " - " +
                      new Date(schedule.start_time).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="rounded border bg-blue-600 px-3 py-2 text-white mt-4"
              onClick={() => setIsRemainingSchedulesModalVisible(false)}
            >
              {translations.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
