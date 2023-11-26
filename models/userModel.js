const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const UserModel = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  isPremiumUser: Sequelize.BOOLEAN,
  totalExpense: Sequelize.INTEGER,
});

module.exports = UserModel;
