import express from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedule,
  getInfoShareLink,
  getInfoShareLinkv2,
  getScheduleByID,
  sharedSchedule,
  updateSchedule,
} from "../controllers/scheduleController.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/get-schedule", getAllSchedule);
scheduleRouter.post("/update-schedule/:idSchedule", updateSchedule);
scheduleRouter.post("/delete-schedule/:id", deleteSchedule);
// shared Links
scheduleRouter.post("/shared-schedule/:id", sharedSchedule);
scheduleRouter.post("/get-info-by-link/:randomString", getInfoShareLink);
scheduleRouter.post("/get-info-by-link2/:randomString", getInfoShareLinkv2);
///----------------------------------------------------------------
scheduleRouter.post("/create-schedule", createSchedule);
scheduleRouter.post("/get-schedule/:id", getScheduleByID);
export default scheduleRouter;
