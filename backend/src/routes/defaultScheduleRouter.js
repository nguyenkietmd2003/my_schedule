import express from "express";
import {
  getDefaultSchedule,
  getIDDefaultSchedule,
  updateDefaultSchedule,
} from "./../controllers/defaultScheduleController.js";

const defaultScheduleRouter = express.Router();
defaultScheduleRouter.post("/get-default-schedule/:userId", getDefaultSchedule);
defaultScheduleRouter.post(
  "/update-default-schedule/:userId",
  updateDefaultSchedule
);
defaultScheduleRouter.post(
  "/get-default-schedule-id/:userId",
  getIDDefaultSchedule
);
//
export default defaultScheduleRouter;
