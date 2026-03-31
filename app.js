require("dotenv").config();
const { verificarConexion } = require("./config/db");
const { sequelize } = require("./config/db");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { Tablero, Lista, Tarjeta } = require("./models");
const { verificarUsuario } = require("./middlewares/auth.middleware");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

app.use(cookieParser());

/* MIDDLEWARE GLOBAL */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* HANDLEBARS */
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views"));
hbs.registerHelper("eq", (a, b) => a === b);

/* 📄 RUTAS DE VISTAS */
app.get("/", (req, res) => {
  res.render("home", { title: "Inicio" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

app.get("/login", (req, res) => {
  const error = req.query.error;

  res.render("login", {
    title: "Login",
    error
  });
});

app.get("/dashboard", verificarUsuario, async (req, res) => {
  try {
    const userId = req.usuario.id;

    let tablero = await Tablero.findOne({
      where: { userId },
      include: {
        model: Lista,
        as: "listas",
        include: {
          model: Tarjeta,
          as: "tarjetas",
        },
      },
      order: [[{ model: Lista, as: "listas" }, "orden", "ASC"]],
    });

    // SI NO EXISTE → CREAR AUTOMÁTICAMENTE
    if (!tablero) {
      // Crear tablero
      const nuevoTablero = await Tablero.create({
        titulo: "Mi tablero",
        userId,
      });

      // Crear listas base
      const listasBase = [
        { titulo: "Pendiente", tipo: "todo" },
        { titulo: "En progreso", tipo: "doing" },
        { titulo: "Hecho", tipo: "done" }
      ];

      await Lista.bulkCreate(
        listasBase.map((lista, index) => ({
          titulo: lista.titulo,
          tipo: lista.tipo, // 🔥 también aquí
          tableroId: nuevoTablero.id,
          orden: index,
        }))
      );

      // Volver a consultar con relaciones
      tablero = await Tablero.findOne({
        where: { id: nuevoTablero.id },
        include: {
          model: Lista,
          as: "listas",
          include: {
            model: Tarjeta,
            as: "tarjetas",
          },
        },
        order: [[{ model: Lista, as: "listas" }, "orden", "ASC"]],
      });
    }

    // TRANSFORMACIÓN (clave)
    const board = {
      name: tablero.titulo,
      lists: tablero.listas.map((lista) => ({
        id: lista.id,
        name: lista.titulo,
        tipo: lista.tipo,
        cards: lista.tarjetas.map((t) => ({
          id: t.id,
          title: t.titulo,
        })),
      })),
    };

    res.render("dashboard", {
      title: "Dashboard",
      board,
    });
  } catch (error) {
    console.error(error);
    res.send("Error cargando dashboard");
  }
});

/*🔌 API (placeholder) */
app.use("/api", require("./routes/api"));
// ⚠️ este archivo lo crearemos ahora

verificarConexion();
sequelize.sync({ alter: true });

/* SERVER */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
