import React, { useState, useEffect, useContext } from "react";
import { createfreeTime } from "../../util/api";
import { AuthContext } from "./../../context/wrapContext";
import { useNavigate } from "react-router-dom";

const FreeTimeForm = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [message, setMessage] = useState("");
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
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
    setTimeOptions(times);

    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const updateEndTimeOptions = (selectedStartTime) => {
    const startIndex = timeOptions.findIndex(
      (time) => time === selectedStartTime
    );
    const availableEndTimes = timeOptions.filter(
      (time, index) => index > startIndex
    );
    setEndTimeOptions(availableEndTimes);
    setEndTime("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !startTime || !endTime) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const userId = auth.user.id;
    const start_time = `${convertDate(selectedDate)}T${convertTime(startTime)}`;
    const end_time = `${convertDate(selectedDate)}T${convertTime(endTime)}`;
    const data = { userId, start_time, end_time };
    console.log(data);

    try {
      const result = await createfreeTime(data);
      console.log(result);
      if (result.data.ER === 0) {
        alert("Đã thêm lịch thành công, quay về trang chủ để xem");
      }
      if (result.data.ER === 1) {
        alert("Lịch thêm đã tồn tại, vui lòng thử lại");
      }
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      setMessage("Lỗi khi thêm thời gian rảnh");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-lg border shadow-md bg-white">
      <h1 className="text-center text-xl font-semibold mb-4">
        Cấu hình thời gian rảnh
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Chọn ngày:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {selectedDate && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian bắt đầu:
              </label>
              <select
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  updateEndTimeOptions(e.target.value);
                }}
                required
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Chọn thời gian bắt đầu
                </option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Thời gian kết thúc:
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={!startTime}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Chọn thời gian kết thúc
                </option>
                {endTimeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="submit"
        >
          Thêm
        </button>

        <button
          className="bg-gray-400 text-white py-2 px-4 rounded-lg w-full mt-2 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          type="button"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </button>
      </form>
      <div
        onClick={() => {
          navigate("/t");
        }}
        className="text-center underline hover:text-blue-600"
      >
        Cấu hình lịch mặc định
      </div>

      {message && (
        <div
          className="mt-5 text-center text-sm font-medium"
          style={{ color: message.includes("thành công") ? "green" : "red" }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default FreeTimeForm;
