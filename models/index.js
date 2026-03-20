const User = require("./User");
const Tablero = require("./Tablero");
const Lista = require("./Lista");
const Tarjeta = require("./Tarjeta");

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

// Lista → Tarjetas
Lista.hasMany(Tarjeta, {
  foreignKey: "listaId",
  as: "tarjetas"
});

Tarjeta.belongsTo(Lista, {
  foreignKey: "listaId",
  as: "lista"
});

module.exports = {
  User,
  Tablero,
  Lista,
  Tarjeta
};