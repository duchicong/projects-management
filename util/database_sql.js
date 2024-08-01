const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pm_db", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: 3308,
});

module.exports = sequelize;
