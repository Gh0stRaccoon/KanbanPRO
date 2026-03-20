const User = require("./User");
const Tablero = require("./Tablero");
const Lista = require("./Lista");

// =========================
// RELACIONES
// =========================

// User → Tableros
User.hasMany(Tablero, {
  foreignKey: "userId",
  as: "tableros"
});

Tablero.belongsTo(User, {
  foreignKey: "userId",
  as: "usuario"
});

// Tablero → Listas
Tablero.hasMany(Lista, {
  foreignKey: "tableroId",
  as: "listas"
});

Lista.belongsTo(Tablero, {
  foreignKey: "tableroId",
  as: "tablero"
});

module.exports = {
  User,
  Tablero,
  Lista
};