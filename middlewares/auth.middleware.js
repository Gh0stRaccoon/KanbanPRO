const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  console.log("👉 Middleware ejecutándose");

  const token = req.cookies.token;

  console.log("COOKIE TOKEN:", token);

  // 1. Validar existencia del token
  if (!token) {
    console.log("❌ No hay cookie");
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token válido:", decoded);

    // 3. Guardar usuario
    req.usuario = decoded;

    next();

  } catch (error) {
    console.log("❌ Token inválido:", error.message);
    return res.status(403).json({ error: "Sesión inválida o expirada" });
  }
}

function verificarUsuario(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login?error=debes_iniciar_sesion");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.redirect("/login?error=sesion_expirada");
  }
}

module.exports = {
  verificarToken,
  verificarUsuario
};