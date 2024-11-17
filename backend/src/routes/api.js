import express from "express";
import userRouter from "./userRouter.js";
import scheduleRouter from "./scheduleRouter.js";
import appointmentRouter from "./appointmentRouter.js";
import freeTimeRouter from "./freeTimeRouter.js";

const apiRouter = express.Router();
apiRouter.use("/v1/apiUser", userRouter); //     USER_ROUTE
apiRouter.use("/v1/apiSchedule", scheduleRouter); //     SCHEDULE_ROUTE
apiRouter.use("/v1/apiAppointment", appointmentRouter); //     SCHEDULE_ROUTE
apiRouter.use("/v1/apiFreeTime", freeTimeRouter); //     SCHEDULE_ROUTE

export default apiRouter;
