import express from "express";
import {
  bookAppointment,
  getBookingByUserID,
  acceptBooking,
  rejectBooking,
  booking,
  acceptBookingg,
  rejectBookingg,
  bookingg,
  requestEmailVerification,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();
appointmentRouter.post("/book-appointment", bookAppointment);
appointmentRouter.get("/get-booking-by-id/:user_id", getBookingByUserID);
appointmentRouter.post("/accept-booking/:id", acceptBooking);
appointmentRouter.post("/reject-booking/:id", rejectBooking);

//v2

appointmentRouter.post("/booking", booking);
appointmentRouter.post("/bookingg", bookingg);
appointmentRouter.post("/sendotp", requestEmailVerification);
appointmentRouter.post("/accept/:id", acceptBookingg);
appointmentRouter.post("/reject/:id", rejectBookingg);
export default appointmentRouter;
