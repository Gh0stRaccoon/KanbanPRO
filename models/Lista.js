const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lista = sequelize.define("Lista", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "listas",
  timestamps: true
});

module.exports = Lista;