import express from "express";
import {
  addFreTime,
  deleteFreeTime,
  getFreeTimeByUserID,
  updateFreeTime,
} from "../controllers/freeTimeController.js";

const freeTimeRouter = express.Router();
freeTimeRouter.post("/create-freeTime", addFreTime);
freeTimeRouter.post("/get-freeTime-by-user", getFreeTimeByUserID);
freeTimeRouter.post("/update/:id", updateFreeTime);
freeTimeRouter.post("/delete/:freeTimeId", deleteFreeTime);

//
export default freeTimeRouter;
