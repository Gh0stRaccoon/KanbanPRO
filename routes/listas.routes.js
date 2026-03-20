const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/auth.middleware");
const listasController = require("../controllers/listas.controller");

// POST /api/tableros/:tableroId/listas
router.post(
  "/tableros/:tableroId/listas",
  verificarToken,
  listasController.createLista
);

// PUT /api/listas/:id
router.put(
  "/listas/:id",
  verificarToken,
  listasController.updateLista
);

// DELETE /api/listas/:id
router.delete(
  "/listas/:id",
  verificarToken,
  listasController.deleteLista
);

module.exports = router;