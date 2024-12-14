import {
  acceptBookingService,
  acceptBookingServicee,
  bookAppointmentService,
  bookingService,
  createBookingService,
  getBookingByUserIDService,
  rejectBookingServicee,
  rejectedBookingService,
  requestEmailVerificationService,
} from "./../services/appointmentService.js";

export const bookingg = async (req, res) => {
  const {
    user_id,
    start_time,
    end_time,
    guest_name,
    guest_email,
    content,
    name_company,
    verificationCode,
  } = req.body;
  try {
    const result = await createBookingService(
      user_id,
      start_time,
      end_time,
      guest_name,
      guest_email,
      content,
      name_company,
      verificationCode
    );
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const requestEmailVerification = async (req, res) => {
  const { guest_email } = req.body;
  try {
    const result = await requestEmailVerificationService(guest_email);
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

///

export const booking = async (req, res) => {
  const {
    free_time_config_id,
    guest_name,
    guest_email,
    content,
    name_company,
  } = req.body;
  try {
    const result = await bookingService(
      free_time_config_id,
      guest_name,
      guest_email,
      content,
      name_company
    );
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptBookingg = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await acceptBookingServicee(id);
    return res.status(200).json({ data: data, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const rejectBookingg = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await rejectBookingServicee(id);
    return res.status(200).json({ data: data, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
////v2
export const bookAppointment = async (req, res) => {
  const { user_id, start_time, end_time, guest_name, guest_email, content } =
    req.body;
  const data = {
    user_id,
    start_time,
    end_time,
    guest_name,
    guest_email,
    content,
  };
  try {
    const result = await bookAppointmentService(data);
    if (result.ER === 1) {
      return res.status(400).json({ status: 400, data: result });
    }
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getBookingByUserID = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await getBookingByUserIDService(user_id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await acceptBookingService(id);
    return res.status(200).json({ data: data, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const rejectBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await rejectedBookingService(id);
    return res.status(200).json({ data: data, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
