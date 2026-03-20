const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/auth.middleware");
const tarjetasController = require("../controllers/tarjetas.controller");

// POST /api/listas/:listaId/tarjetas
router.post(
  "/listas/:listaId/tarjetas",
  verificarToken,
  tarjetasController.createTarjeta
);

// PUT /api/tarjetas/:id
router.put(
  "/tarjetas/:id",
  verificarToken,
  tarjetasController.updateTarjeta
);

// DELETE /api/tarjetas/:id
router.delete(
  "/tarjetas/:id",
  verificarToken,
  tarjetasController.deleteTarjeta
);

module.exports = router;