import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Booking from  "./Booking.js";
import _EmailVerification from  "./EmailVerification.js";
import _FreeTimeConfiguration from  "./FreeTimeConfiguration.js";
import _Notification from  "./Notification.js";
import _OTP from  "./OTP.js";
import _PublicLink from  "./PublicLink.js";
import _User from  "./User.js";
import _WorkSchedule from  "./WorkSchedule.js";

export default function initModels(sequelize) {
  const Booking = _Booking.init(sequelize, DataTypes);
  const EmailVerification = _EmailVerification.init(sequelize, DataTypes);
  const FreeTimeConfiguration = _FreeTimeConfiguration.init(sequelize, DataTypes);
  const Notification = _Notification.init(sequelize, DataTypes);
  const OTP = _OTP.init(sequelize, DataTypes);
  const PublicLink = _PublicLink.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);
  const WorkSchedule = _WorkSchedule.init(sequelize, DataTypes);

  Booking.belongsTo(FreeTimeConfiguration, { as: "free_time_config", foreignKey: "free_time_config_id"});
  FreeTimeConfiguration.hasMany(Booking, { as: "Bookings", foreignKey: "free_time_config_id"});
  FreeTimeConfiguration.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(FreeTimeConfiguration, { as: "FreeTimeConfigurations", foreignKey: "user_id"});
  Notification.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Notification, { as: "Notifications", foreignKey: "user_id"});
  PublicLink.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(PublicLink, { as: "PublicLinks", foreignKey: "user_id"});
  WorkSchedule.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(WorkSchedule, { as: "WorkSchedules", foreignKey: "user_id"});
  Notification.belongsTo(WorkSchedule, { as: "work_schedule", foreignKey: "work_schedule_id"});
  WorkSchedule.hasMany(Notification, { as: "Notifications", foreignKey: "work_schedule_id"});

  return {
    Booking,
    EmailVerification,
    FreeTimeConfiguration,
    Notification,
    OTP,
    PublicLink,
    User,
    WorkSchedule,
  };
}
