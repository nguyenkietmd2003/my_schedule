import express from "express";
import {
  addFreTime,
  getFreeTimeByUserID,
} from "../controllers/freeTimeController.js";

const freeTimeRouter = express.Router();
freeTimeRouter.post("/create-freeTime", addFreTime);
freeTimeRouter.post("/get-freeTime-by-user", getFreeTimeByUserID);

//
export default freeTimeRouter;
