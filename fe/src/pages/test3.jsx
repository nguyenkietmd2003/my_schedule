import React, { useEffect, useState } from "react";

const AP = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // Lưu trữ ngày đã chọn
  const [selectedSlots, setSelectedSlots] = useState([]); // Lưu trữ các slot lịch cho ngày đã chọn
  // Dữ liệu tĩnh thay cho API
  const defaultSchedules = [
    {
      day_of_week: "Sunday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Monday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Tuesday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Wednesday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Thursday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Friday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
    {
      day_of_week: "Saturday",
      start_time: "01:00:00",
      end_time: "02:00:00",
    },
  ];
  const booking1 = [
    {
      id: 1,
      start_time: "2024-12-01T18:00:00.000Z",
      end_time: "2024-12-01T18:30:00.000Z",
    },
  ];
  const schedule = [
    {
      id: 1,
      start_time: "2024-12-01T18:30:00.000Z",
      end_time: "2024-12-01T19:00:00.000Z",
    },
  ];
  const freeTime = [
    {
      id: 4,
      free_time_start: "2024-12-04T18:00:00.000Z",
      free_time_end: "2024-12-04T18:30:00.000Z",
    },
  ];
  useEffect(() => {}, []);
  // Hàm xử lý khi người dùng click vào một ngày
  const handleDateClick = (date, schedules) => {
    const selectedSlots = generateSlotsForDay(date, schedules);
    setSelectedDate(date);
    setSelectedSlots(selectedSlots);
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

    // Lấy các lịch đã gộp lại
    const mergedSchedules = mergeSchedules(defaultSchedules, freeTime);

    // Render tiêu đề các ngày trong tuần
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
          {`${lastMonthDate.getDate() - i + 1}/${lastMonthDate.getMonth() + 1}`}
        </div>
      );
    }

    // Các ngày trong tháng hiện tại
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      const isToday =
        currentDate.getDate() === todayDate &&
        currentDate.getMonth() === todayMonth &&
        currentDate.getFullYear() === todayYear;

      // Kiểm tra nếu ngày hiện tại có lịch đã gộp
      const isScheduledDay = mergedSchedules.some((schedule) => {
        const scheduleStart = new Date(schedule.free_time_start);
        const scheduleEnd = new Date(schedule.free_time_end);
        return currentDate >= scheduleStart && currentDate <= scheduleEnd;
      });

      calendarDays.push(
        <div
          key={currentDate.toISOString()}
          className={`day ${isToday ? "today" : ""} ${
            isScheduledDay ? "has-schedule" : ""
          }`}
          onClick={() => handleDateClick(currentDate, mergedSchedules)} // Xử lý sự kiện click
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

  const generateSlotsForDay = (date) => {
    const slots = [];

    // Lấy tên ngày trong tuần từ ngày hiện tại
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    // Lọc lịch theo tên ngày trong tuần
    const selectedSchedules = defaultSchedules.filter(
      (schedule) => schedule.day_of_week === dayOfWeek
    );

    // Kiểm tra lịch cá nhân cho ngày đã chọn
    const personalForDay = freeTime.filter((schedule) => {
      const scheduleStart = new Date(schedule.free_time_start);
      return (
        date.toISOString().split("T")[0] ===
        scheduleStart.toISOString().split("T")[0]
      );
    });

    const finalSchedules =
      personalForDay.length > 0 ? personalForDay : selectedSchedules;

    // Gộp tất cả các booking và schedule để kiểm tra
    const allBookingsAndSchedules = [
      ...booking1.map((b) => ({
        start: new Date(b.start_time),
        end: new Date(b.end_time),
      })),
      ...schedule.map((s) => ({
        start: new Date(s.start_time),
        end: new Date(s.end_time),
      })),
    ];

    // Tạo các slot từ lịch đã chọn
    finalSchedules.forEach((schedule) => {
      let start;
      let end;

      if (schedule.start_time && schedule.end_time) {
        const [startHour, startMinute] = schedule.start_time
          .split(":")
          .map(Number);
        const [endHour, endMinute] = schedule.end_time.split(":").map(Number);
        start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          startHour,
          startMinute
        );
        end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          endHour,
          endMinute
        );
      } else {
        start = new Date(schedule.free_time_start);
        end = new Date(schedule.free_time_end);
      }

      while (start < end) {
        const slotEnd = new Date(start.getTime() + 30 * 60000); // Tăng 30 phút
        if (slotEnd <= end) {
          // Kiểm tra xem slot có bị trùng với booking hoặc schedule không
          const isBookedOrScheduled = allBookingsAndSchedules.some((item) => {
            return (
              (start >= item.start && start < item.end) ||
              (slotEnd > item.start && slotEnd <= item.end)
            );
          });

          if (!isBookedOrScheduled) {
            slots.push({
              id: `${start.toISOString()}-${slotEnd.toISOString()}`,
              start: start,
              end: slotEnd,
            });
          }
        }
        start = slotEnd;
      }
    });

    return slots;
  };

  const mergeSchedules = (defaultSchedules, freeTime) => {
    const allSchedules = [];

    // Gộp lịch mặc định
    defaultSchedules.forEach((schedule) => {
      const today = new Date();
      const currentDay = today.getDay(); // 0: CN, 1: Thứ 2, ...
      const dayOffset = (schedule.day_of_week - currentDay + 7) % 7;

      const scheduleDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + dayOffset
      );

      const [startHour, startMinute] = schedule.start_time
        .split(":")
        .map(Number);
      const [endHour, endMinute] = schedule.end_time.split(":").map(Number);

      allSchedules.push({
        free_time_start: new Date(
          scheduleDate.getFullYear(),
          scheduleDate.getMonth(),
          scheduleDate.getDate(),
          startHour,
          startMinute
        ),
        free_time_end: new Date(
          scheduleDate.getFullYear(),
          scheduleDate.getMonth(),
          scheduleDate.getDate(),
          endHour,
          endMinute
        ),
      });
    });

    // Gộp lịch cá nhân
    freeTime.forEach((schedule) => {
      const start = new Date(schedule.free_time_start);
      const end = new Date(schedule.free_time_end);

      allSchedules.push({
        free_time_start: start,
        free_time_end: end,
      });
    });

    return allSchedules;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button className="month-button previous">&#60;</button>
        <button className="month-button next">&#62;</button>
      </div>

      <div className="grid">{renderCalendar()}</div>

      {selectedDate && (
        <div className="schedule-details">
          <h3>Slot lịch cho ngày {selectedDate.toLocaleDateString()}</h3>
          {selectedSlots.length > 0 ? (
            <ul>
              {selectedSlots.map((slot) => (
                <li key={slot.id}>
                  {slot.start.toLocaleTimeString()} -{" "}
                  {slot.end.toLocaleTimeString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có lịch cho ngày này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AP;
