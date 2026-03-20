require("dotenv").config();
const { verificarConexion } = require("./config/db");
const { sequelize } = require("./config/db");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { Tablero, Lista, Tarjeta } = require("./models");

const app = express();
const PORT = 3000;

/* =========================
   🧱 MIDDLEWARE GLOBAL
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   🎨 HANDLEBARS
========================= */
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views"));

/* =========================
   📄 RUTAS DE VISTAS
========================= */
app.get("/", (req, res) => {
  res.render("home", { title: "Inicio" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/dashboard", async (req, res) => {
  try {
    const userId = 1;

    const tablero = await Tablero.findOne({
      where: { userId },
      include: {
        model: Lista,
        as: "listas",
        include: {
          model: Tarjeta,
          as: "tarjetas"
        }
      }
    });

    // 🔁 TRANSFORMACIÓN (clave)
    const board = {
      name: tablero.titulo,
      lists: tablero.listas.map(lista => ({
        id: lista.id,
        name: lista.titulo,
        cards: lista.tarjetas.map(t => ({
          id: t.id,
          title: t.titulo
        }))
      }))
    };

    res.render("dashboard", {
      title: "Dashboard",
      board
    });

  } catch (error) {
    console.error(error);
    res.send("Error cargando dashboard");
  }
});

/* =========================
   🔌 API (placeholder)
========================= */
app.use("/api", require("./routes/api")); 
// ⚠️ este archivo lo crearemos ahora

verificarConexion();
sequelize.sync({ alter: true });

/* =========================
   ▶️ SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});