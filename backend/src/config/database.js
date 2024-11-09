import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

// pull code  npx  sequelize-auto -h localhost -d mysql_BookingSchedue -u root -x 1234 -p 3307 --dialect mysql -o src/models -l esm
