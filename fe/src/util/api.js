import axios from "./axiosCustom";

export const loginAPI = (email, password) => {
  const URL_API = "v1/apiUser/login";
  return axios.post(URL_API, { email: email, password: password });
};
export const sendOtp = (email) => {
  const URL_API = "/v1/apiUser/send-otp";
  return axios.post(URL_API, { email });
};
export const verifyOtp = (email, name, password, otp) => {
  const URL_API = "/v1/apiUser/register2";
  return axios.post(URL_API, { email, name, password, otp });
};
//
export const getSchedule = (id) => {
  const URL_API = "v1/apiSchedule/get-schedule";
  return axios.get(URL_API, { id });
};
export const getScheduleById = (id) => {
  const URL_API = `/v1/apiSchedule/get-schedule/${id}`;
  return axios.post(URL_API, { id });
};
export const createSchedule = (data) => {
  const URL_API = "v1/apiSchedule/create-schedule";
  return axios.post(URL_API, data);
};
export const deleteSchedule = (id) => {
  const URL_API = `/v1/apiSchedule/delete-schedule/${id}`;
  return axios.post(URL_API);
};
export const shareLink = (id) => {
  const URL_API = `/v1/apiSchedule/shared-schedule/${id}`;
  return axios.post(URL_API);
};
export const getInfoByLink = (randomString) => {
  const URL_API = `/v1/apiSchedule/get-info-by-link/${randomString}`;
  return axios.post(URL_API);
};
export const booking = (data) => {
  const URL_API = "/v1/apiAppointment/book-appointment";
  return axios.post(URL_API, data);
};
export const updateSchedule = (id, data) => {
  const URL_API = `/v1/apiSchedule/update-schedule/${id}`;
  return axios.post(URL_API, data);
};
export const getBooking = (user_id) => {
  const URL_API = `/v1/apiAppointment/get-booking-by-id/${user_id}`;
  return axios.get(URL_API);
};
export const acceptBooking = (id) => {
  const URL_API = `/v1/apiAppointment/accept-booking/${id}`;
  return axios.post(URL_API);
};
export const rejectBooking = (id) => {
  const URL_API = `/v1/apiAppointment/reject-booking/${id}`;
  return axios.post(URL_API);
};
export const getInfoUser = (user_id) => {
  const URL_API = `/v1/apiUser/get-info/${user_id}`;
  return axios.post(URL_API);
};

///---------------------------------------------------------------- v2
export const createfreeTime = (data) => {
  const URL_API = "/v1/apiFreeTime/create-freeTime";
  return axios.post(URL_API, data);
};

export const getFreeTimeByUser = (user_id) => {
  const URL_API = `/v1/apiFreeTime/get-freeTime-by-user`;
  return axios.post(URL_API, { user_id: user_id });
};
