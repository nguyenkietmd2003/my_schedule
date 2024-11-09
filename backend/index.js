import express from "express";
import cors from "cors";
import { configEngine } from "./src/config/configEngine.js";
import { sequelize } from "./src/config/database.js";
import apiRouter from "./src/routes/api.js";
import checkAndSendNotifications from "./src/services/notificationService.js";
const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
configEngine(app);

app.use(apiRouter);

(async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(`>>> Error to connect to the database:" ${error}`);
  }
})();

checkAndSendNotifications();
