import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDefaultSchedule,
  getIDDefaultSchedule,
  updateDefaultSchedule,
} from "../util/api";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const formatTimeToAMPM = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const hoursInt = parseInt(hours, 10);
  const isPM = hoursInt >= 12;
  const formattedHours =
    hoursInt > 12 ? hoursInt - 12 : hoursInt === 0 ? 12 : hoursInt;
  const formattedMinutes = minutes.padStart(2, "0");
  const period = isPM ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const TestPage = () => {
  const [apiSchedule, setApiSchedule] = useState([]); // Lưu dữ liệu API
  const [defaultScheduleId, setDefaultScheduleId] = useState(0);
  const timeOptions = populateTimeOptions();
  const [userId, setUserId] = useState(0);

  const [schedule, setSchedule] = useState(
    days.map(() => ({
      start: "",
      end: "",
      active: false,
      endTimeOptions: timeOptions,
      unavailable: true,
    }))
  );

  const fetchScheduleFromAPI = async () => {
    const getInfo = localStorage.getItem("info");
    const user = JSON.parse(getInfo);
    setUserId(user?.data?.user?.id);
    const defaultScheduleID = await getIDDefaultSchedule(user?.data?.user?.id);
    setDefaultScheduleId(defaultScheduleID.data);
    const apiResponse = await getDefaultSchedule(user?.data?.user?.id);
    ///
    //
    //
    const apiData = apiResponse.data.schedule;
    setApiSchedule(apiData);

    const updatedSchedule = days.map((day, index) => {
      const daySchedule = {
        start: "",
        end: "",
        active: false,
        endTimeOptions: timeOptions,
        unavailable: true,
      };

      const apiDay = apiData.find(
        (d) => d.day_of_week === day // So sánh tên ngày đúng với dữ liệu API
      );

      if (apiDay) {
        const { start_time, end_time } = apiDay;

        // Chuyển đổi start_time và end_time sang định dạng 12 giờ
        const formattedStart = formatTimeToAMPM(start_time);
        const formattedEnd = formatTimeToAMPM(end_time);

        const startIndex = timeOptions.findIndex(
          (time) => time === formattedStart
        );

        daySchedule.start = formattedStart;
        daySchedule.end = formattedEnd;
        daySchedule.endTimeOptions = timeOptions.filter(
          (_, idx) => idx > startIndex
        );
        daySchedule.unavailable = false;
        daySchedule.active = true;
      }

      return daySchedule;
    });

    setSchedule(updatedSchedule);
  };

  useEffect(() => {
    fetchScheduleFromAPI();
  }, []);
  const updateScheduleToAPI = async (updatedDays) => {
    try {
      const getInfo = localStorage.getItem("info");
      const user = JSON.parse(getInfo);

      // Gọi hàm updateDefaultSchedule với thông tin cần thiết
      const response = await updateDefaultSchedule(
        user?.data?.user?.id,
        updatedDays
      );
      console.log(response);

      // Kiểm tra response
      if (response?.status !== 200 || response?.data?.ER !== 0) {
        throw new Error(response?.data?.message || "Failed to update schedule");
      }

      alert(response.data.message || "Schedule updated successfully!");
      return updatedDays; // Trả về lịch cập nhật (giả định API không trả về lịch mới)
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert(error.message || "Error updating schedule. Please try again.");
      return null;
    }
  };

  const handleStartTimeChange = (dayIndex, selectedStartTime) => {
    const newSchedule = [...schedule];

    // Kiểm tra nếu `selectedStartTime` có giá trị
    if (!selectedStartTime) {
      newSchedule[dayIndex].start = ""; // Reset nếu không chọn gì
      newSchedule[dayIndex].endTimeOptions = [];
    } else {
      newSchedule[dayIndex].start = selectedStartTime;

      const startIndex = timeOptions.findIndex(
        (time) => time === selectedStartTime
      );
      newSchedule[dayIndex].endTimeOptions = timeOptions.slice(startIndex + 1); // slice chỉ khi hợp lệ
    }

    newSchedule[dayIndex].end = ""; // Reset end nếu start thay đổi
    setSchedule(newSchedule);
  };

  const handleEndTimeChange = (dayIndex, selectedEndTime) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].end = selectedEndTime || ""; // Nếu `undefined`, gán giá trị rỗng
    setSchedule(newSchedule);
  };

  const toggleActive = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    if (!newSchedule[index].active) {
      newSchedule[index].start = "";
      newSchedule[index].end = "";
    }
    setSchedule(newSchedule);
  };

  const handleSubmit = async () => {
    let validationErrors = [];

    const selectedDays = schedule
      .filter((item) => item.active) // Chỉ lọc các ngày active
      .map((item, index) => {
        if (!item.start || !item.end) {
          validationErrors.push(`Bạn chưa chọn giờ cho ${days[index]}.`);
          return null; // Nếu thời gian không hợp lệ, trả về null
        }

        // Chuyển đổi start_time và end_time sang định dạng 24 giờ
        const startTime24 = formatTimeTo24Hours(item.start);
        const endTime24 = formatTimeTo24Hours(item.end);

        return {
          default_schedule_id: defaultScheduleId, // Thêm `default_schedule_id`
          day_of_week: days[index], // Lấy tên ngày
          start_time: startTime24, // Đã chuyển đổi
          end_time: endTime24, // Đã chuyển đổi
        };
      })
      .filter(Boolean); // Loại bỏ các giá trị null (ngày không hợp lệ)

    // Hiển thị lỗi nếu có
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    // Payload được tạo và log ra console
    const payload = { scheduleData: selectedDays };

    try {
      // Gửi request đến backend
      const response = await updateDefaultSchedule(userId, payload);
      console.log("Response:", response);

      // Kiểm tra phản hồi từ API
      if (response?.status === 200 && response?.data?.ER === 0) {
        alert(response.data.message || "Lịch đã được cập nhật thành công!");

        // Kiểm tra xem API trả về có chứa schedule không
        const apiData = Array.isArray(response?.data?.schedule)
          ? response.data.schedule
          : [];

        const updatedSchedule = days.map((day, index) => {
          const daySchedule = {
            start: "",
            end: "",
            active: false,
            endTimeOptions: timeOptions,
            unavailable: true,
          };

          // Kiểm tra xem có ngày nào trong apiData khớp với ngày hiện tại không
          const apiDay = apiData.find((d) => d.day_of_week === day);

          if (apiDay) {
            const { start_time, end_time } = apiDay;

            // Chuyển đổi start_time và end_time sang định dạng 12 giờ
            const formattedStart = formatTimeToAMPM(start_time);
            const formattedEnd = formatTimeToAMPM(end_time);

            const startIndex = timeOptions.findIndex(
              (time) => time === formattedStart
            );

            daySchedule.start = formattedStart;
            daySchedule.end = formattedEnd;
            daySchedule.endTimeOptions = timeOptions.filter(
              (_, idx) => idx > startIndex
            );
            daySchedule.unavailable = false;
            daySchedule.active = true;
          } else {
            // Giữ lại thông tin lịch hiện tại nếu không có dữ liệu API cho ngày này
            daySchedule.start = schedule[index]?.start || "";
            daySchedule.end = schedule[index]?.end || "";
            daySchedule.endTimeOptions =
              schedule[index]?.endTimeOptions || timeOptions;
            daySchedule.active = schedule[index]?.active || false;
          }

          return daySchedule;
        });

        setSchedule(updatedSchedule); // Cập nhật state với lịch mới
      } else {
        alert(response?.data?.message || "Cập nhật lịch không thành công.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const formatTimeTo24Hours = (time) => {
    const [hours, minutes] = time.split(":");
    const period = time.slice(-2); // Lấy "AM" hoặc "PM"
    let formattedHours = parseInt(hours, 10);

    // Chuyển đổi AM/PM sang 24 giờ
    if (period === "PM" && formattedHours !== 12) {
      formattedHours += 12; // Chuyển giờ PM thành 24h (trừ 12PM)
    } else if (period === "AM" && formattedHours === 12) {
      formattedHours = 0; // Chuyển 12AM thành 00
    }

    return `${String(formattedHours).padStart(2, "0")}:${minutes.slice(
      0,
      2
    )}:00`; // Trả về thời gian ở định dạng HH:mm:ss
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg border shadow-md bg-white">
      <h1 className="text-center text-xl font-semibold mb-4">Weekly Hours</h1>
      <div className="space-y-4">
        {days.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2 rounded-lg border bg-gray-50 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={schedule[index].active}
                onChange={() => toggleActive(index)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>
            {schedule[index].active && (
              <div className="flex items-center space-x-2">
                <select
                  value={schedule[index].start}
                  onChange={(e) => handleStartTimeChange(index, e.target.value)}
                  required
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Start Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {schedule[index].start && (
                  <select
                    value={schedule[index].end}
                    onChange={(e) => handleEndTimeChange(index, e.target.value)}
                    required={!!schedule[index].start}
                    disabled={!schedule[index].start}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      End Time
                    </option>
                    {schedule[index].endTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Submit
        </button>
        <div className="mt-4">
          <Link
            className="text-xs text-center text-gray-600 underline cursor-pointer"
            to={"/"}
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
