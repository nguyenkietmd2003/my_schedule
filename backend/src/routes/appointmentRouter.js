import express from "express";
import {
  bookAppointment,
  getBookingByUserID,
  acceptBooking,
  rejectBooking,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();
appointmentRouter.post("/book-appointment", bookAppointment);
appointmentRouter.get("/get-booking-by-id/:user_id", getBookingByUserID);
appointmentRouter.post("/accept-booking/:id", acceptBooking);
appointmentRouter.post("/reject-booking/:id", rejectBooking);

export default appointmentRouter;
