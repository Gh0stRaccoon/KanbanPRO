const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/tableros", require("./tableros.routes"));
router.use("/", require("./listas.routes"));

module.exports = router;