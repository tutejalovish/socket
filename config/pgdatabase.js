require("dotenv").config();

const { Sequelize } = require("sequelize");

let options = {
  multipleStatements: true,
  connectTimeout: 180000,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  encrypt: false,
  trustServerCertificate: false,
  charset: "utf8mb4",
};

let poolOption = {
  max: 100,
  min: 0,
  idle: 10000,
  acquire: 100 * 1000,
};

const hrms = new Sequelize(
  process.env.DB_HRMS,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HRMS_HOST,
    dialect: "mysql",
    dialectOptions: options,
    pool: poolOption,
  },
);

const emp = new Sequelize(
  process.env.DB_EMPLOYEE,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HRMS_HOST,
    dialect: "mysql",
    dialectOptions: options,
    pool: poolOption,
  },
);

module.exports = { hrmsDB: hrms, empDB: emp };