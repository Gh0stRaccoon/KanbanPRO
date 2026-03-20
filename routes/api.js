const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/tableros", require("./tableros.routes"));
router.use("/", require("./listas.routes"));
router.use("/", require("./tarjetas.routes"));

module.exports = router;