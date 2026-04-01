const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function verificarConexion() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");
  } catch (error) {
    console.error("❌ DB ERROR:", error);
    throw error; // IMPORTANTE
  }
}

module.exports = { sequelize, verificarConexion };